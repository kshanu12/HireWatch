import styles from "./candidateRecord.module.css";
import {
  LinkOutlined,
  MinusOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Tooltip } from 'antd';


function CandidateRecord(props) {
  const getActionIcon = () => {
    switch (props.action) {
      case "Send Test Link":
        return <LinkOutlined />;
      case "- - -":
        return <MinusOutlined />;
      case "View Live":
        return <VideoCameraOutlined />;
      case "View Report":
        return <FileTextOutlined />;
    }
  };
  return (
    <div className={styles.candidate__record}>
      <p
        className={`${styles.candidate__record_no} ${styles.candidate__record_detail}`}
      >
        {props.no}
      </p>
      <p
        className={`${styles.candidate__record_name} ${styles.candidate__record_detail}`}
      >
        {props.name}
      </p>
      <p
        className={`${styles.candidate__record_email} ${styles.candidate__record_detail}`}
      >
        {props.email}
      </p>
      <p
        className={`${styles.candidate__record_tech} ${styles.candidate__record_detail}`}
      >
        {props.techstack}
      </p>
      <p
        className={`${styles.candidate__record_test} ${styles.candidate__record_detail}`}
      >
        {props.testname}
      </p>
      <p
        className={`${styles[props.status.replaceAll(" ", "_")]} ${styles.candidate__record_status
          } ${styles.candidate__record_detail}`}
      >
        {props.status}
      </p>
      {props.action === "- - -" ? (
        <MinusOutlined/> 
      ) : (
        <Tooltip title={props.action} placement="bottom" color="rgb(136, 153, 190)">
          <div
            onClick={() => {
              props.handleClick(
                props.application_id,
                props.action,
                props.action_id,
                props.status,
                props.status_id,
                props.email,
                props.broadcast_id
              );
            }}
            className={`${styles.btn} ${styles[props.action.replaceAll(" ", "_")]}`}
          >
            {getActionIcon(props.action)}
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default CandidateRecord;
