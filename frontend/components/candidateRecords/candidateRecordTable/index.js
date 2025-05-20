import React from "react";
import CandidateRecord from "./candidateRecord/index";
import styles from "./candidateRecordTable.module.css";
import { Pagination } from "antd";
import { useState } from "react";
import TableLoader from "@/components/tableLoader";

function CandidateRecordsTable(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  // console.log("qwerty", props.candidates);
  const candidateRecordsList = props.candidates;
  const onChange = (page) => {
    // console.log(page);
    setCurrentPage(page);
  };

  return (
    <div className={styles.records__table}>
      <div className={styles.records__table_header}>
        <p className={styles.records__table_column_header}>Sl No.</p>
        <p className={styles.records__table_column_header}>Candidate Name</p>
        <p className={styles.records__table_column_header}>Email</p>
        <p className={styles.records__table_column_header}>Techstack Name</p>
        <p className={styles.records__table_column_header}>Testname</p>
        <p className={styles.records__table_column_header}>Status</p>
        <p className={styles.records__table_column_header}>Action</p>
      </div>
      {candidateRecordsList != null ? (
        candidateRecordsList.length > 0 ? (
          candidateRecordsList
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((candidate, index) => (
              <CandidateRecord
                className={styles.record}
                key={index}
                handleClick={props.handleClick}
                no={pageSize * (currentPage - 1) + index + 1}
                name={candidate.first_name + " " + candidate.last_name}
                email={candidate.email}
                techstack={candidate.tech_stack_name}
                testname={candidate.test_name}
                status={candidate.application_status_name}
                action={candidate.application_action_name}
                application_id={candidate.application_id}
                action_id={candidate.action_id}
                status_id={candidate.status_id}
                broadcast_id={candidate.broadcast_id}
              />
            ))
        ) : (
          <div className={styles.noRecord}>No candidates found.</div>
        )
      ) : (
        <TableLoader />
      )}
      {candidateRecordsList != null && (
        <Pagination
          className={styles.pagination}
          current={currentPage}
          onChange={onChange}
          total={candidateRecordsList.length}
          pageSize={9}
        />
      )}
    </div>
  );
}

export default CandidateRecordsTable;
// sl, name, email, techstack, test name, status, action
