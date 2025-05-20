import React from "react";
import CandidateRecordsTable from "./candidateRecordTable/index";
import styles from "./candidateRecords.module.css";

function CandidateRecords(props) {
  return (
    <div className={styles.container}>
      <CandidateRecordsTable
        handleClick={props.handleClick}
        candidates={props.candidates}
      />
    </div>
  );
}

export default CandidateRecords;
