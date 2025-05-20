import { useEffect, useRef } from 'react';
import styles from "./instructionWebcam.module.css";

const InstructionWebCam = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: {height:435}, audio: false };

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = mediaStream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getMedia();
  }, []);

  return (
    <div className={styles.videoContainer}>
      <video className={styles.video} ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default InstructionWebCam;