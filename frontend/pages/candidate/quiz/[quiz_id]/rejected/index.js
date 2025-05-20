import Header from "@/components/header";
import styles from "../../../../../styles/submitted.module.css";
import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const refreshCount = sessionStorage.getItem("reloadCount");

    if (refreshCount < 2) {
      window.location.reload();
      sessionStorage.setItem("reloadCount", 2);
    }
  }, []);

  return (
    <div className={styles.mainPage}>
      <Header />
      <div className={styles.cardcontainer}>
        <div className={styles.card}>
          <img src="/image/disqualified.png" alt="error" ></img>
          <h4>Test Finished</h4>
          <p>You've been disqualified from the test due to repeated violations</p>
        </div>
      </div>
    </div>
  );
};

export default Test;