import {
  AppstoreOutlined,
  ContainerOutlined,
  PieChartOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import styles from "./sidebar.module.css";
import { Tooltip } from "antd";
import { useRouter } from "next/router";

const Sidebar = () => {
    const router = useRouter();
  const handleButtonClick = (buttonIndex) => {
    if (buttonIndex == 0) {
      router.push(`/hr/dashboard?id=${router.query.id}`);
    } else if (buttonIndex == 1) {
      router.push(`/hr/analytics?id=${router.query.id}`);
    } else if (buttonIndex == 2) {
      router.push(`/hr/view_test?id=${router.query.id}`);
    } else if (buttonIndex == 3) {
      router.push(`/hr/create_test?id=${router.query.id}`);
    }
  };

    return (
        <>
            <div className={styles.sidenav}>
                <div className={styles.icons}>
                    <div className={styles.button}>
                        <Tooltip placement="rightBottom" color="#000000" title="Dashboard">
                            <button className={styles.dashboard} onClick={() => handleButtonClick(0)}>
                            <AppstoreOutlined className={styles.icons}/> 
                            </button>
                        </Tooltip>
                    </div>
                    <div className={styles.button}>
                        <Tooltip placement="rightBottom" color="#000000" title="Analytics">
                            <button className={styles.dashboard} onClick={() => handleButtonClick(1)}>
                            <PieChartOutlined className={styles.icons}/>                            
                            </button>
                        </Tooltip>
                    </div>
                    <div className={styles.button}>
                        <Tooltip placement="rightBottom" color="#000000" title="View Test">
                            <button className={styles.dashboard} onClick={() => handleButtonClick(2)}>
                            <ContainerOutlined className={styles.icons}/>                            
                            </button>
                        </Tooltip>
                    </div>
                    <div className={styles.button}>
                        <Tooltip placement="rightBottom" color="#000000" title="Create Test">
                            <button className={styles.dashboard} onClick={() => handleButtonClick(3)}>
                            <ScheduleOutlined className={styles.icons}/>                            
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.hashedin}>
                    <span>Hashed<span style={{ color: 'orange' }}>In</span></span>
                    <div className={styles.smalltext}>
                        By Deloitte
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;
