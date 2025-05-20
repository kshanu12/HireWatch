import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import ViolationCard from "@/components/violationCard";
import ViolationList from "@/components/violationList";
import styles from "@/styles/report.module.css";
import { Spin } from "antd";

import { useState, useEffect } from "react";
import WarningModal from "../../../../../components/broadcaster/warning";
import { getViolationByApplicationId } from "@/method/violation";
import { getApplicationById } from "@/method/application";
import { useRouter } from "next/router";
import { dbInit } from "@/method/db_init";

const Report = () => {
  const router = useRouter();
  const [imageData, setImageData] = useState("");
  const [violationList, setViolationList] = useState([]);
  const [applicationDetails, setApplicationDetails] = useState([]);
  const [detectedObject, setDetectedObject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.candidate_id) {
        const application = await getApplicationById(router.query.candidate_id);
        // console.log("APPLICATION", application[0]);
        application[0].started_at = application[0].started_at
          .split("T")[1]
          .slice(0, -1)
          .split(".")[0];
        application[0].ended_at = application[0].ended_at
          .split("T")[1]
          .slice(0, -1)
          .split(".")[0];

        setApplicationDetails(application);

        const violations = await getViolationByApplicationId(
          router.query.candidate_id
        );
        setViolationList(violations);

        const totalMarks = await dbInit(application[0].test_id);
        setTotalScore(Number(totalMarks.results[0].total_marks));
      }
    };
    fetchData();
  }, [router.query.candidate_id]);

  const displayImage = (type, image) => {
    setImageData(image);
    setDetectedObject(type);
    setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
    setDetectedObject("");
  };

  const data = [
    {
      title: "Name",
      value: applicationDetails[0]?.user_name,
      icon: "name",
    },
    {
      title: "Tech-Stack",
      value: applicationDetails[0]?.tech_stack_name,
      icon: "techstack",
    },
    {
      title: "Test Name",
      value: applicationDetails[0]?.test_name,
      icon: "test",
    },
    {
      title: "Duration",
      value:
        applicationDetails[0]?.started_at +
        " - " +
        applicationDetails[0]?.ended_at,
      icon: "duration",
    },
    {
      title: "Score",
      value: applicationDetails[0]?.scored + "/" + totalScore,
      icon: "score1",
    },
  ];
  return (
    <div style={{ background: "#eee" }}>
      <Header />
      <div className={styles.mainCard}>
        <Sidebar />
        {data[0].value != undefined ? (
          <div>
            <ViolationCard data={data} />
            <div className={styles.vioaltionList}>
              <ViolationList
                violations={violationList}
                displayImage={displayImage}
                imageData={imageData}
              ></ViolationList>
            </div>
            <div>
              <WarningModal
                detectedObject={detectedObject}
                showModal={showModal}
                modalMessage={
                  <img src={imageData} alt="Image" width="400" height="300" />
                }
                handleOk={handleOk}
              />
            </div>
          </div>
        ) : (
          <Spin size="large" className={styles.spiner} />
        )}
      </div>
    </div>
  );
};

export default Report;
