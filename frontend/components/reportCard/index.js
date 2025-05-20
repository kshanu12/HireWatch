import React, { useState, useEffect, useRef } from "react";
import { Card } from "antd";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { getCandidateResponse } from "@/method/report";
import { personDataAsync } from "@/redux/slice/peopleSlice";
import { useAppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/store";
import jsPDF from "jspdf";
import { getViolationByApplicationId } from "@/method/violation";
import { getApplicationById } from "@/method/application";
import ViolationCard from "@/components/violationCard";
import { dbInit } from "@/method/db_init";
import { IssuesCloseOutlined } from "@ant-design/icons";

function Questions() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const downloadPdfRef = useRef(null);

  const extractCandidateId = (path) => {
    const startIndex = path.indexOf("/hr/candidate/") + "/hr/candidate/".length;
    const endIndex = path.indexOf("/", startIndex);
    const candidateId = path.substring(startIndex, endIndex);
    return candidateId;
  };
  const questionSelector = useAppSelector((state) => {
    return state.peopleData;
  });
  const candidateId = extractCandidateId(router.asPath);

  const [candidateResponse, setCandidateResponse] = useState([]);
  const [questions, setQuestions] = useState(
    questionSelector.questionsByTestId
  );

  useEffect(() => {
    setQuestions(questionSelector.questionsByTestId);
  }, [questionSelector, router.query.candidate_id]);

  useEffect(() => {
    const fetchResponse = async () => {
      if (router.query.candidate_id) {
        const res = await getCandidateResponse(router.query.candidate_id);
        setCandidateResponse(res.message);
        dispatch(personDataAsync(candidateId));
      }
    };
    fetchResponse();
  }, [router.query.candidate_id]);
  // console.log("CANDIDATE RESPONSE", candidateResponse);
  // console.log("QUESTIONS", questions);

  const exportToPdfHandler = async () => {
    const doc = new jsPDF({
      format: "a1",
      unit: "pt",
      orientation: "landscape",
    });

    doc.html(downloadPdfRef.current, {
      callback(doc) {
        let docName =
          applicationDetails[0].test_name +
          "_report_" +
          applicationDetails[0].user_name;
        docName = docName.replace(/ /g, "_").toLowerCase();
        doc.save(docName);
      },
    });
  };

  const [applicationDetails, setApplicationDetails] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [violationList, setViolationList] = useState([]);

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
      value: applicationDetails[0]?.scored + " / " + totalScore,
      icon: "score2",
    },
  ];

  // console.log("QUESTIONS", questions);
  // console.log("CANDIDATE RESPONSE", candidateResponse);

  return (
    <div className={styles.main}>
      <div className={styles.expdf}>
        <h1></h1>
        <button className={styles.pdf} onClick={exportToPdfHandler}>
          {" "}
          Export PDF{" "}
        </button>
      </div>
      <div ref={downloadPdfRef}>
        <ViolationCard data={data} />
        {candidateResponse.length != 0 &&
          questions.map((question, index) => (
            <Card key={question.id} className={styles.card}>
              <div>
                <h3 className={styles.heading}>
                  <div>
                    <span style={{ color: "red" }}>*</span>
                    Question ID {question.key + 1}
                  </div>
                  <div className={styles.mark}>
                    {candidateResponse[index].is_correct ? question.marks : "0"}{" "}
                    / {question.marks} Mark(s)
                  </div>
                </h3>
                <div className={styles.quizbox}>
                  <div id={styles.question}>{question.questionDesc}</div>
                  <div id={styles.optionsContainer}>
                    {question.option.map((opt) =>
                      opt.optionId != candidateResponse[index].option_id ? (
                        opt.is_answer == true ? (
                          <label key={opt.optionId} className={styles.correct}>
                            <input
                              type="radio"
                              name={`option_${question.id}`}
                              className={styles.optionRadio}
                              value={opt.optionDescription}
                              disabled
                            />
                            <span className={styles.optionText}>
                              {opt.optionDescription}
                            </span>
                          </label>
                        ) : (
                          <label
                            key={opt.optionId}
                            className={styles.optionLabel}
                          >
                            <input
                              type="radio"
                              name={`option_${question.id}`}
                              className={styles.optionRadio}
                              value={opt.optionDescription}
                              disabled
                            />
                            <span className={styles.optionText}>
                              {opt.optionDescription}
                            </span>
                          </label>
                        )
                      ) : (
                        <label
                          key={opt.optionId}
                          className={
                            candidateResponse[index].is_correct
                              ? styles.correct
                              : styles.wrong
                          }
                        >
                          <input
                            type="radio"
                            name={`option_${question.id}`}
                            className={styles.optionRadio}
                            value={opt.optionDescription}
                            checked
                          />
                          <span className={styles.optionText}>
                            {opt.optionDescription}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}
export default Questions;