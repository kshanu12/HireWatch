import styles from "./leadersidebar.module.css";
import { Tooltip } from "antd";
import { ContainerOutlined, ScheduleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const LeaderSidebar = () => {
  const router = useRouter();
  const handleButtonClick = (buttonIndex) => {
    // console.log("Button clicked:", buttonIndex);
    if (buttonIndex == 0) {
      router.push(`/leader/view_test?id=${router.query.id}`);
    } else if (buttonIndex == 1) {
      router.push(`/leader/create_test?id=${router.query.id}`);
    }
  };

  return (
    <>
      <div className={styles.sidenav}>
        <div className={styles.icons}>
          <div className={styles.button} onClick={() => handleButtonClick(0)}>
            <Tooltip placement="rightBottom" color="#000000" title="View Test">
              <button className={styles.dashboard}>
                <ContainerOutlined className={styles.icons} />
              </button>
            </Tooltip>
          </div>
          <div className={styles.button} onClick={() => handleButtonClick(1)}>
            <Tooltip
              placement="rightBottom"
              color="#000000"
              title="Create Test"
            >
              <button className={styles.dashboard}>
                <ScheduleOutlined className={styles.icons} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className={styles.hashedin}>
          <span>
            Hashed<span style={{ color: "orange" }}>In</span>
          </span>
          <div className={styles.smalltext}>By Deloitte</div>
        </div>
      </div>
    </>
  );
};

export default LeaderSidebar;
