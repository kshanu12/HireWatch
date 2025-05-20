import React from "react";
import ViolationRecordTable from "./violationRecordTable";
import styles from "./violationRecords.module.css";

function ViolationRecords(props) {
    
    return (
      <div className={styles.container}>
        <ViolationRecordTable
          violations={props.violations}
          displayImage={props.displayImage}
          imageData={props.imageData}
        />
      </div>
    );
}

export default ViolationRecords;