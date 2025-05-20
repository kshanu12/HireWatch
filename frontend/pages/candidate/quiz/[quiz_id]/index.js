import Header from "@/components/header";
import Sidecard from "@/components/sidecard";
import styles from "../../../../styles/quiz.module.css";
import Questions from "@/components/questioncard";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/socket.provider";
import SubmitModal from "@/components/submitModal";
import { useRouter } from "next/router";
import { addCandidateResponse } from "@/method/report";
import { updateApplicationById } from "@/method/application";
import { updateOneTimePassword } from "@/method/user";
import { updateApplicationScore } from "@/method/application";

const QuizId = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const socketRef = useSocket();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allOptionsTicked, setAllOptionsTicked] = useState(false);
  const [candidateResponse, setCandidateResponse] = useState([]);
  const [score, setScore] = useState(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = async() => {
    socketRef.emit("test-submitted");
    // console.log("Selected Options:", selectedOptions);
    // console.log("ALL RESPONSE", candidateResponse);
    // console.log("SCORE: ", router.query.id,score);
    await updateApplicationScore(router.query.id, score);
    await addCandidateResponse(candidateResponse);

    updateApplicationById(router.query.id, 8, 4);
    updateOneTimePassword(router.query.id);

    socketRef.emit("test-submitted");

    router.push("1/submitted");

    closeModal();
  };

  // console.log("CURRENT QUESTION",currentQuestion);

  return (
    <div className={styles.mainPage}>
      <Header />
      <Sidecard
        // handleSubmit={handleSubmit}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        openModal={openModal}
        closeModal={closeModal}
        handleConfirmSubmit={handleConfirmSubmit}
      />
      <div className={styles.cardcontainer}>
        <Questions
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          allOptionsTicked={allOptionsTicked}
          setAllOptionsTicked={setAllOptionsTicked}
          candidateResponse={candidateResponse}
          setCandidateResponse={setCandidateResponse}
          score={score}
          setScore={setScore}
        />
      </div>
      <SubmitModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};

export default QuizId;
