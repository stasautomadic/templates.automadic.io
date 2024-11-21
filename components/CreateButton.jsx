import React, { useState } from 'react';
import { Preview } from '@creatomate/preview';
import { finishVideo } from '@/utility/finishVideo';
import styles from '@/styles/Home.module.css';

export const CreateButton = (props) => {
  const [isRendering, setIsRendering] = useState(false);
  const [render, setRender] = useState();

  const userId = localStorage.getItem('userId');

  if (isRendering) {
    return (
      <button 
      className={styles.renderingButton}
      disabled
    >
      Rendering...
    </button>
    );
  }

  if (render) {
    return (
      <button
      className={styles.downloadButton}
      onClick={() => {
        window.open(render.url, '_blank');
        setRender(undefined);
      }}
    >
      Download
    </button>
    );
  }

  return (
    <button
      className={styles.createButton}
      onClick={async () => {
        setIsRendering(true);

        try {
        
          const render = await finishVideo(props.preview, userId , props.templateNames);
          console.log(render.status)
          if (render.status == "succeeded") {
            setRender(render);
          } else {
            window.alert(`Rendering failed: ${render.errorMessage}`);
          }
        } catch (error) {
          window.alert(error);
        } finally {
          setIsRendering(false);
        }
      }}
    >
      Create Video
    </button>
  );
};
