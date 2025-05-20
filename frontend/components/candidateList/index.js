import styles from "./candidateList.module.css";
import { Tooltip } from "antd";
import { useState, useEffect } from "react";
import Filter from "../filter";
import CandidateRecords from "../candidateRecords";
import { updateAllApplication } from "@/method/application";
import { sendMail } from "@/method/user";
import { updateApplicationById } from "@/method/application";

const CandidateList = (props) => {
  const onClearHandler = () => {
    props.setEnteredViolations(100);
    props.setMinimumScore(0);
    props.setSelectedStatus(null);
    props.setSelectedTestName(null);
  };
  const [updateAcceptCandidates, setUpdateAcceptCandidates] = useState([]);
  const [updateRejectCandidates, setUpdateRejectCandidates] = useState([]);
  const [updateSendLinkCandidates, setUpdateSendLinkCandidates] = useState([]);

  const onAcceptHandler = async () => {
    const filteredCandidates = props.candidates.data.filter(
      (candidate) => candidate.application_status_id === 8
    );
    setUpdateAcceptCandidates(filteredCandidates);
  };

  useEffect(() => {
    updateAllApplication(updateAcceptCandidates, 9);
    props.setToggleState(!props.toggleState);
  }, [updateAcceptCandidates]);

  const onRejectHandler = () => {
    const filteredCandidates = props.candidates.data.filter(
      (candidate) => candidate.application_status_id === 8
    );
    setUpdateRejectCandidates(filteredCandidates);
  };

  useEffect(() => {
    updateAllApplication(updateRejectCandidates, 10);
    props.setToggleState(!props.toggleState);
  }, [updateRejectCandidates]);

  const onSendLinkHandler = () => {
    const filteredCandidates = props.candidates.data.filter(
      (candidate) => candidate.application_status_id === 5
    );
    setUpdateSendLinkCandidates(filteredCandidates);
  };

  useEffect(() => {
    // console.log("++++++++++++++++++", updateSendLinkCandidates);

    const updateCandidates = async () => {
      await Promise.all(
        updateSendLinkCandidates.map(async (candidate) => {
          await updateApplicationById(candidate.application_id, 6, 2);
        })
      );

      props.setToggleState(!props.toggleState);
      sendMail(updateSendLinkCandidates);
    };

    updateCandidates();
  }, [updateSendLinkCandidates]);

  return (
    <>
      <div className={styles.mainelement}>
        <div className={styles.header}>
          <h1 className={styles.title}>Candidate List</h1>
          <div className={styles.buttons}>
            <div
              className={
                props.selectedStatus == 8
                  ? styles.display_block
                  : styles.display_none
              }
            >
              <Tooltip
                title="Accept all candidates"
                placement="bottom"
                color="rgb(136, 153, 190)"
              >
                <button className={styles.accept} onClick={onAcceptHandler}>
                  Accept
                </button>
              </Tooltip>
            </div>
            <div
              className={
                props.selectedStatus == 8
                  ? styles.display_block
                  : styles.display_none
              }
            >
              <Tooltip
                title="Reject all candidates"
                placement="bottom"
                color="rgb(136, 153, 190)"
              >
                <button className={styles.reject} onClick={onRejectHandler}>
                  Reject
                </button>
              </Tooltip>
            </div>

            <div
              className={
                props.selectedStatus == 5
                  ? styles.display_block
                  : styles.display_none
              }
            >
              <Tooltip
                title="Send Test Link"
                placement="bottom"
                color="rgb(136, 153, 190)"
              >
                <button
                  className={styles.send_link}
                  onClick={onSendLinkHandler}
                >
                  Send Link
                </button>
              </Tooltip>
            </div>
            <Tooltip
              title="Clear all filters"
              placement="bottom"
              color="rgb(136, 153, 190)"
            >
              <button
                className={styles["clear-button"]}
                onClick={onClearHandler}
              >
                Clear filters
              </button>
            </Tooltip>
            <Filter
              className={styles.filterbutton}
              status={props.status}
              setSelectedStatus={props.setSelectedStatus}
              setEnteredViolations={props.setEnteredViolations}
              setMinimumScore={props.setMinimumScore}
              testNames={props.testNames}
              setSelectedTestName={props.setSelectedTestName}
              selectedStatus={props.selectedStatus}
              selectedTestName={props.selectedTestName}
              enterdMinimumScore={props.enterdMinimumScore}
              enteredViolations={props.enteredViolations}
            ></Filter>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.candidateRecordTable}>
            <CandidateRecords
              handleClick={props.handleClick}
              candidates={props.candidates.data}
            ></CandidateRecords>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateList;
