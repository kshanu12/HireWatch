import CandidateList from "@/components/candidateList";
import Sidebar from "@/components/sidebar";
import styles from "../../../styles/dashboard.module.css";
import Header from "@/components/header";

import React, { useEffect, useState, useRef } from "react";
import { getCandidates, sendMail } from "../../../method/user";
import { getAllTests } from "../../../method/test";
import DraggableModal from "../../../components/draggable-modal";
import {
  getApplicationById,
  updateApplicationById,
} from "@/method/application";
import { getTestById } from "../../../method/test";
import { useRouter } from "next/router";
import { useSocket } from "@/context/socket.provider";
import { getAllStatus } from "@/method/status";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const Dashboard = () => {
  const router = useRouter();
  const [candidates, setCandidates] = useState({});
  const [status, setStatus] = useState([]);
  const [testNames, setTestNames] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [enteredViolations, setEnteredViolations] = useState(
    100
  );
  const [enterdMinimumScore, setMinimumScore] = useState(0);
  const [selectedTestName, setSelectedTestName] = useState(null);
  const [toggleState, setToggleState] = useState(false);

  // streaming
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  // const socketRef = useSocket();
  const proctorPeerInstance = useRef(null);
  const videoRef = useRef(null);
  let [proctorVideoRef, setProctorVideoRef] = useState(null); // don't send it to candidate
  const socketRef = useSocket();

  const disableUserMedia = () => {
    if (proctorVideoRef) {
      const tracks = proctorVideoRef.getTracks();
      tracks.forEach((track) => track.stop());
      setProctorVideoRef(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const app_status = await getAllStatus();
      if (app_status != null) {
        const application_status = app_status.map((status) => {
          return { id: status.id, name: status.name };
        });
        setStatus(application_status);
      }
      const test_names = await getAllTests();
      const testNames = test_names.map((test) => {
        return { id: test.id, name: test.name };
      });
      setTestNames(testNames);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const candidates = await getCandidates(
        enteredViolations,
        enterdMinimumScore,
        selectedTestName,
        selectedStatus
      );
      // console.log("CANDIDATES", candidates);
      setCandidates(candidates);
    };
    fetchData();
  }, [
    selectedStatus,
    enteredViolations,
    enterdMinimumScore,
    selectedTestName,
    toggleState,
  ]);

  useEffect(() => {
    socketRef.on("render-component", () => {
      // console.log("trigger render-component");
      setToggleState(!toggleState);
    });

    socketRef.on("live-stream-ended", () => {
      // console.log("live-stream-ended");
      setShowVideo(false);
      disableUserMedia();
      setToggleState(toggle => !toggle);
    });
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  const DraggableModalContent = (
    <div>
      {loading &&       
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin indicator={antIcon} />
      </div>
}
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );

  const handleClick = async (
    application_id,
    action,
    action_id,
    status,
    status_id,
    email,
    broadcast_id
  ) => {
    if (action.toLowerCase() == "send test link") {
      const applicationDetails = await getApplicationById(application_id);
      const testDetails = await getTestById(applicationDetails[0].test_id);
      // console.log("TEST DETAILS", applicationDetails, testDetails.duration);
      const newCandidateObject = {
        application_id: application_id,
        email: email,
        first_name: applicationDetails[0].user_name.split(" ")[0],
        test_name: applicationDetails[0].test_name,
        duration: testDetails.duration,
      };
      // console.log(newCandidateObject);
      const arrayObject=[newCandidateObject]
      sendMail(arrayObject);
      const updateApplication = await updateApplicationById(
        application_id,
        6,
        2
      );
      setToggleState(!toggleState);
    } else if (action.toLowerCase() == "view report") {
      router.push(`/hr/candidate/${application_id}/report?id=${router.query.id}`);
    } else if (action.toLowerCase() == "view live") {
      setLoading(true);
      setShowVideo(true);
      import("peerjs").then(({ default: Peer }) => {
        proctorPeerInstance.current = new Peer({ debug: 3 });
        proctorPeerInstance.current.on("open", () => {
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
              setProctorVideoRef(stream);
              //console.log("stream", stream);

              var call = proctorPeerInstance.current.call(broadcast_id, stream);
              call.on("stream", (remoteStream) => {
                videoRef.current.srcObject = remoteStream;
                setLoading(false);
              });
            })
            .catch((error) => {
              console.error("Error accessing media devices:", error);
            });
        });
      });
    }
  };

  return (
    <>
      <div className={styles.dashboard}>
        <Header></Header>
        <Sidebar></Sidebar>
        <div className={styles.candidateList}>
          <CandidateList
            status={status}
            setSelectedStatus={setSelectedStatus}
            setEnteredViolations={setEnteredViolations}
            setMinimumScore={setMinimumScore}
            testNames={testNames}
            setSelectedTestName={setSelectedTestName}
            selectedStatus={selectedStatus}
            selectedTestName={selectedTestName}
            enterdMinimumScore={enterdMinimumScore}
            enteredViolations={enteredViolations}
            candidates={candidates}
            handleClick={handleClick}
            toggleState={toggleState}
            setToggleState={setToggleState}
          ></CandidateList>
        </div>
        {showVideo && (
          <DraggableModal
            title="Candidate Live Stream"
            content={DraggableModalContent}
            open={showVideo}
            setOpen={setShowVideo}
            proctorVideoRef={proctorVideoRef}
            setProctorVideoRef={setProctorVideoRef}
            setShowVideo={setShowVideo}
          ></DraggableModal>
        )}
      </div>
    </>
  );
};
export default Dashboard;
