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
          <img src="/image/check.png" alt="checkmark"></img>
          <h4>Submitted Succesfully</h4>
          <p>Thankyou for taking up the Exam</p>
        </div>
      </div>
    </div>
  );
};

export default Test;
