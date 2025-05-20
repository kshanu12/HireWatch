import React from "react";
import ViolationRecord from "./violationRecord";
import styles from "./violationRecordTable.module.css";
import { Pagination } from "antd";
import { useState } from "react";
import TableLoader from "@/components/tableLoader";

function ViolationRecordTable(props) {


  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 6;

  const onChange = (page) => {
    // console.log(page);
    setCurrentPage(page);
  };

  const violationRecordList = props.violations;

  return (
    <div className={styles.records__table}>
      <div className={styles.records__table_header}>
        <p className={styles.records__table_column_header}>SL NO.</p>
        <p className={styles.records__table_column_header}>TYPE</p>
        <p className={styles.records__table_column_header}>TITLE</p>
        <p className={styles.records__table_column_header}>IMAGE</p>
      </div>
      {violationRecordList ? (
        Array.isArray(violationRecordList) &&
          violationRecordList.length > 0 ? (
          violationRecordList
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((violation, index) => (
              <ViolationRecord
                className={styles.record}
                key={index}
                no={pageSize * (currentPage - 1) + index + 1}
                type={violation.type}
                title={violation.type}
                image={violation.image}
                displayImage={props.displayImage}
                imageData={props.imageData}
              />
            ))
        ) : (
          <div className={styles.noRecord}>No violations found.</div>
        )
      ) : (
        <TableLoader />
        // <div></div>
      )}
      {violationRecordList != null && (
        <Pagination
          className={styles.pagination}
          current={currentPage}
          onChange={onChange}
          total={violationRecordList.length}
          pageSize={6}
        />
      )}
    </div>
  );
}

export default ViolationRecordTable;
