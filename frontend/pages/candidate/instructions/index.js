import React from "react";
import InstructionWebCam from "../../../components/instructionwebcam";
import Header from "@/components/header";
import styles from "../../../styles/Instruction.module.css";
import Card from "@/components/card";
import { useRouter, Router } from "next/router";
import { useState } from "react";
import Loader from "@/components/loader";
import {
  updateApplicationById,
  updateApplicationStartTime,
} from "@/method/application";
import { personDataAsync } from "@/redux/slice/peopleSlice";
import { useAppDispatch } from "@/redux/store";

const CandidateInstructionsPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", (url) => {
    // console.log("Route is changing");
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", (url) => {
    // console.log("Route change is complete");
    setLoading(false);
  });

  const router = useRouter();

  const requestFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  const onClickHandler = async (e) => {
    const updateApplication = await updateApplicationById(
      router.query.id,
      7,
      3
    );
    const started_at = new Date().toISOString();
    await updateApplicationStartTime(router.query.id, started_at);
    dispatch(personDataAsync(router.query.id));
    router.push(`/candidate/quiz/1?id=${router.query.id}`);
    requestFullScreen();
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className={styles.mainPage}>
          <Header />
          <div className={styles.cardh}>
            <Card className={styles.center_items}>
              <div className={styles.broadcaster}>
                <div className={styles.title_webcam}>Web Cam Feed</div>
                <InstructionWebCam></InstructionWebCam>
              </div>
            </Card>
            <Card title="Test Instructions" description="Read carefully">
              <div className={styles.instructions}>
                <br />
                <h3>Do's :</h3>
                <ul className={styles.ulItems}>
                  <li>• Find a quiet and well-lit room.</li>
                  <li>
                    <p>• Review your answers before submitting the exam.</p>
                  </li>
                  <li>
                    <p>
                      • Focus solely on the test without any external
                      distractions.
                    </p>
                  </li>
                  <li>
                    <p>
                      • Manage your time wisely to complete the test within the
                      given duration.
                    </p>
                  </li>
                  <li>
                    <p>
                      • Double-check your answers or work for any mistakes
                      before submitting.
                    </p>
                  </li>
                </ul>
                <br />
                <h3 className={styles.dont}>Don't :</h3>
                <ul className={styles.ulItems}>
                  <li>
                    <p>• Do not leave the exam room or camera view.</p>
                  </li>
                  <li>
                    <p>
                      • Avoid communicating or collaborating with others during
                      the exam.
                    </p>
                  </li>
                  <li>
                    <p>
                      • Do not disrupt the test environment or violate any
                      testing protocols.
                    </p>
                  </li>
                  <li>
                    <p>
                      • Do not use any unauthorized materials or resources
                      during the exam.
                    </p>
                  </li>
                  <li>
                    <p>
                      • Avoid using additional applications, internet browsing,
                      or unauthorized devices.
                    </p>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
          <div className={styles.SButton}>
            <button
              className={styles.StartButton}
              type="button"
              onClick={onClickHandler}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateInstructionsPage;
