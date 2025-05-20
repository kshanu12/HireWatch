import styles from "./video.module.css"

const Video = (props) => {
  return (
    <>
      <div className={styles.videoContainer}>
        <video className={styles.video} ref={props.video} autoPlay playsInline />
      </div>
      {/* <button onClick={() => setVideoOn((it) => !it)}>
          Turn Video {props.videoOn ? 'Off' : 'On'}
        </button> */}
    </>
  );
};

export default Video;
