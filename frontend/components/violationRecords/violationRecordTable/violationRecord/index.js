import styles from "./violationRecord.module.css";
import { Button } from "antd";
import {
  FrownOutlined,
  TeamOutlined,
  MobileOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

function ViolationRecord(props) {
  const stringImageMapping = () => {
    switch (props.type) {
      case " Face Not Detected":
        return <FrownOutlined />;
      case " Multiple Person Detected":
        return <TeamOutlined />;
      case " Mobile Phone Detected":
        return <MobileOutlined />;
      case " Prohibited Object Detected":
        return <StopOutlined />;
      case " Attention Required":
        return <ExclamationCircleOutlined />;
      default:
        return <WarningOutlined />;
    }
  };

  return (
    <div className={styles.violation__record}>
      <p
        className={`${styles.violation__record_no} ${styles.violation__record_detail}`}
      >
        {props.no}
      </p>
      <p
        className={`${styles.violation__record_type} ${styles.violation__record_detail} ${styles[props.type.replaceAll(" ", "_")]}`}
      >
          {stringImageMapping(props.type)}
      </p>
      <p
        className={`${styles.violation__record_title} ${styles.candidate__record_detail}`}
      >
        {props.title}
      </p>
      <div className={styles.center_image_btn}>
        <Button
          className={styles.button}
          onClick={() => props.displayImage(props.type, props.image)}
        >
          View Image
        </Button>
      </div>
    </div>
  );
}

export default ViolationRecord;
