import React, { useEffect, useState } from "react";
import styles from "../../../styles/createtest.module.css";
import Header from "@/components/header";
import TestID from "@/components/testInput";
import AddQuizQuestion from "@/components/addquizquestions";
import Sidebar from "@/components/sidebar";
import AddCodingQuestion from "@/components/addCodingQuestions";
import { getAllTechStack } from "@/method/tech_stack";
import { useRouter } from "next/router";
import { addQuizQuestions } from "@/method/question";

const Candidate = () => {
  const router = useRouter();
  // console.log("ROUTER", router);
  const [testType, setTestType] = useState(1);
  const [testName, setTestName] = useState("");
  const [duration, setDuration] = useState(0);
  const [techStack, setTechStack] = useState([]);
  const [selectedTechStack, setSelectedTechStack] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    const fetchTechStack = async () => {
      const res = await getAllTechStack();
      setTechStack(res);
    };
    fetchTechStack();
  }, []);

  const handleSubmit = async () => {
    let score = 0;
    quizQuestions.map((quizQuestion) => {
      score = score + Number(quizQuestion.marks);
    });
    const formData = {
      testName: testName,
      testType: testType,
      duration: duration,
      score: score,
      selectedTechStack: selectedTechStack,
      creator_id: router.query.id,
      // creator_id:22,
      questions: quizQuestions,
    };
    router.push(`/hr/view_test?id=${router.query.id}`);
    await addQuizQuestions(formData);

    // console.log(formData);
  };

  // };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <Sidebar></Sidebar>
      <div className={styles.maincard}>
        <TestID
          testType={testType}
          setTestType={setTestType}
          testName={testName}
          setTestName={setTestName}
          duration={duration}
          setDuration={setDuration}
          techStack={techStack}
          setTechStack={setTechStack}
          selectedTechStack={selectedTechStack}
          setSelectedTechStack={setSelectedTechStack}
        />
        <div
          className={testType == 1 ? styles.display_block : styles.display_none}
        >
          <AddQuizQuestion
            quizQuestions={quizQuestions}
            setQuizQuestions={setQuizQuestions}
            handleSubmit={handleSubmit}
          />
        </div>
        <div
          className={testType == 2 ? styles.display_block : styles.display_none}
        >
          <AddCodingQuestion />
        </div>
      </div>
    </div>
  );
};

export default Candidate;
