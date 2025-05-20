import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ReportCard from "@/components/reportCard";
import styles from "../../../../../../styles/candidateResponse.module.css";
const Report = () => {
  return (
    <div className={styles.pageContainer}>
      <Header/>
      <Sidebar/>
      <div className={styles.main}>
        <ReportCard/>
      </div>
    </div>
  );
};

export default Report;