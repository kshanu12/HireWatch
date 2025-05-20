import React from "react";
import styles from "./testanalyticscard.module.css";

const TestCard = () => {
  return (<div className={styles.main}>
    <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img src="/image/icon.svg" alt="Icon" className={styles.icon} />
          <h3 className={styles.title}>150</h3>
        <p className={styles.content}>candidates</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
        <img src="/image/tech.png" alt="Icon" className={styles.icon} />
          <h3 className={styles.title}>Java, React</h3>
        <p className={styles.content}>Tech Stack</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
        <img src="/image/test.png" alt="Icon" className={styles.icon} />
          <h3 className={styles.title}>Test 3</h3>
        <p className={styles.content}>Test</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
        <img src="/image/log.svg" alt="Icon" className={styles.icon} />
          <h3 className={styles.title}>70</h3>
        <p className={styles.content}>Invites Sent</p>
      </div>
      </div>
    </div>
  );
};

export default TestCard;
