import React, { useState, useEffect } from "react";
import Broadcaster from "../broadcaster";
import { useRouter } from "next/router";
import {
  getApplicationById,
  updateApplicationById,
} from "@/method/application";
import { updateOneTimePassword } from "@/method/user";
import { getTestById } from "@/method/test";
import styles from "./style.module.css";

const Sidecard = (props) => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [techStack, setTechStack] = useState("");
  const [testName, setTestName] = useState("");
  const [timer, setTimer] = useState(15 * 60); // Set initial timer value to 15 minutes in seconds
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        const applicationDetails = await getApplicationById(router.query.id);
        setUserName(applicationDetails[0]?.user_name);
        setTechStack(applicationDetails[0]?.tech_stack_name);
        setTestName(applicationDetails[0]?.test_name);
        const testDetails = await getTestById(applicationDetails[0]?.test_id);
        setTimer(testDetails.duration * 60);
      }
    };
    fetchData();
  }, [router.query.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Helper function to format the timer value as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${remainingSeconds}`;
    return formattedTime;
  };

  useEffect(() => {
    // console.log("timer", timer);
    if (timer === 0) {
      // Timer has reached 00:00:00, handle timer completion logic here
      updateApplicationById(router.query.id, 8, 4);
      updateOneTimePassword(router.query.id);
      router.push("1/submitted");
    }
  }, [timer]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    closeModal();
  };

  return (
    <div className={styles.main}>
      <div className={styles.first}>
        <div className={styles.camera}>
          <Broadcaster />
        </div>
      </div>
      <div className={styles.second}>
        <div className={styles.inside}>
          <h2>Details</h2>
          <div className={styles.one}>
            <h3>Name:</h3>
            <p>{userName}</p>
          </div>
          <div className={styles.two}>
            <h3>TechStack</h3>
            <p>{techStack}</p>
          </div>
          <div className={styles.thirdT}>
            <h3>Test Name</h3>
            <p>{testName}</p>
          </div>
        </div>
      </div>
      <div className={styles.third}>
        <span className={styles.timer}>Timer : </span>
        {formatTime(timer)}
      </div>
      <div className={styles.btn}>
        <button className={styles.submit} onClick={props.openModal}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Sidecard;
