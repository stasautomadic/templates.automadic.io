import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { Preview, PreviewState } from '@creatomate/preview';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useWindowWidth } from '@/utility/useWindowWidth';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export const Detail = ({ id }) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const [videoAspectRatio, setVideoAspectRatio] = useState();
  const previewRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentState, setCurrentState] = useState(null);

  // Extract projectID from query params
  const { projectID } = router.query;

  const setUpPreview = (htmlElement) => {
    if (previewRef.current) {
      previewRef.current.dispose();
      previewRef.current = undefined;
    }

    // Use projectID instead of environment variable
    const preview = new Preview(htmlElement, 'player', projectID);

    preview.onReady = async () => {
      await preview.loadTemplate(id); // Use the ID from the URL
      setIsReady(true);
    };

    preview.onLoad = () => {
      setIsLoading(true);
    };

    preview.onLoadComplete = () => {
      setIsLoading(false);
    };

    preview.onStateChange = (state) => {
      setCurrentState(state);
      setVideoAspectRatio(state.width / state.height);
    };

    previewRef.current = preview;
  };

  useEffect(() => {
    if (previewRef.current && id) {
      setUpPreview(previewRef.current.element);
    }
  }, [id, projectID]); // Add projectID to the dependency array

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <div className={styles.wrapper}>
      <div className="custom-iframe-wrapper">
        <div
          className={styles.container}
          ref={(htmlElement) => {
            if (htmlElement && htmlElement !== previewRef.current?.element) {
              setUpPreview(htmlElement);
            }
          }}
          style={{
            position: 'unset',
            height:
              videoAspectRatio && windowWidth && windowWidth < 768
                ? window.innerWidth / videoAspectRatio
                : undefined,
          }}
        />
      </div>
      </div>

      <div className={styles.panel}>
        {isReady && previewRef.current && (
          <div className={styles.panelContent} id="panel">
            <SettingsPanel id={id} preview={previewRef.current} currentState={currentState} />
          </div>
        )}
      </div>

      {isLoading && <div className={styles.loadIndicator}>Loading...</div>}
    </main>
  );
};
