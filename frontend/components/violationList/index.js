import ViolationRecords from "../violationRecords";
import styles from "./violationList.module.css";
import { useRouter } from "next/router";
import {
  getApplicationById,
  updateApplicationAcceptRejectStatus,
} from "@/method/application";
import { useState, useEffect } from "react";

const ViolationList = (props) => {
  const [acceptButtonText, setAcceptButtonText] = useState("Accept");
  const [rejectButtonText, setRejectButtonText] = useState("Reject");
  const [rejectButtonVisibility, setRejectButtonVisibility] = useState(null);
  const [acceptButtonVisibility, setAcceptButtonVisibility] = useState(null);

  const router = useRouter();
  // console.log("ROUTER", router);
  const segments = router.asPath.split("/");
  // if (segments) console.log(segments[3]);
  useEffect(() => {
    const syncCandidateStatus = async () => {
      if (router.query.candidate_id) {
        const application = await getApplicationById(router.query.candidate_id);
        if (application && application.length > 0) {
          if (application[0].application_status_id === 9) {
            setAcceptButtonText("Accepted");
            setRejectButtonVisibility("hidden");
          } else if (application[0].application_status_id === 10) {
            setRejectButtonText("Rejected");
            setAcceptButtonVisibility("hidden");
          }
        }
      }
    };

    syncCandidateStatus();
  }, [router.query.candidate_id, acceptButtonText, rejectButtonText]);

  const responseHandler = () => {
    router.push(
      `${router.asPath.split("?")[0]}/candidate_response?id=${router.query.id}`
    );
  };

  const acceptHandler = () => {
    if (acceptButtonText != "Accepted") {
      setAcceptButtonText("Accepted");
      setRejectButtonVisibility("hidden");
      updateApplicationAcceptRejectStatus(router.query.candidate_id, 9);
    }
  };

  const rejectHandler = () => {
    if (rejectButtonText != "Rejected") {
      setRejectButtonText("Rejected");
      setAcceptButtonVisibility("hidden");
      updateApplicationAcceptRejectStatus(router.query.candidate_id, 10);
    }
  };

  const handleRejectButtonVisibility = () => {
    return acceptButtonText === "Accepted" ? "hidden" : null;
  };

  return (
    <>
      <div className={styles.mainCard}>
        <div className={styles.header}>
          <h1>Violation List</h1>
          <div className={styles.buttons}>
            <button
              className={styles.candidateResponse}
              onClick={responseHandler}
            >
              View Response
            </button>
            <button
              className={styles.accept}
              onClick={acceptHandler}
              hidden={acceptButtonVisibility}
            >
              {acceptButtonText}
            </button>
            <button
              className={styles.reject}
              onClick={rejectHandler}
              hidden={rejectButtonVisibility}
            >
              {rejectButtonText}
            </button>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.violationRecordTable}>
            <ViolationRecords
              violations={props.violations}
              displayImage={props.displayImage}
              imageData={props.imageData}
            ></ViolationRecords>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViolationList;
