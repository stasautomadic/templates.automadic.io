import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Template } from '../types';
import { getAllTemplates } from '../utility/api';
import styles from '@/styles/Home.module.css';

const Main = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [clickLoading, setClickLoading] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false); // Done fetching
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (templateId, projectID) => {
    setClickLoading(true);  // Set loading when clicking on a template
    router.push({
      pathname: `/${templateId}`,
      query: { projectID },
    });
  };

  return (
    <div>
      {loading || clickLoading ? ( // Show loader when page is loading or template is clicked
        <div className="flex justify-center items-center h-screen">
          <div className={styles.loader} />
        </div>
      ) : templates ? (
        <>
          <div className={styles.grid}>
            {templates.map((template) => (
              <div
                key={template.templateId}
                className={styles.card}
                style={{ backgroundImage: `url(${template.image})` }}
                onClick={() => handleTemplateClick(template.templateId, template.projectID)}
              >
              </div>
            ))}
          </div>
        </>
      ) : "No Template Found!"}
    </div>
  );
};

export default Main;
