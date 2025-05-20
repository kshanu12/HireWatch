import React, { useState, useEffect } from "react";
import { Card, Button } from "antd";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useAppSelector } from "@/redux/store";

function Questions(props) {
  const router = useRouter();
  const questionSelector = useAppSelector((state) => {
    return state.peopleData;
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(questionSelector.questionsByTestId);
  }, [questionSelector.questionsByTestId]);

  useEffect(() => {
    const allOptionsSelected = questions.every(
      (question) => props.selectedOptions[question.id - 1]
    );
    props.setAllOptionsTicked(allOptionsSelected);
  }, [questions, props.selectedOptions]);

  const handleSelectOption = (
    questionKey,
    question_id,
    option_id,
    is_correct,
    marks
  ) => {
    if (is_correct === true) props.setScore(props.score + marks);

    props.setCandidateResponse((candidateResponse) => {
      const updateCandidateResponse = [...candidateResponse];
      updateCandidateResponse[questionKey - 1] = {
        application_id: Number(router.query.id),
        question_id,
        option_id,
        is_correct,
      };
      return updateCandidateResponse;
    });

    props.setSelectedOptions((prevSelectedOptions) => {
      const updatedSelectedOptions = [...prevSelectedOptions];
      updatedSelectedOptions[questionKey - 1] = option_id;
      return updatedSelectedOptions;
    });
  };

  const handleNext = () => {
    if (props.currentQuestion < questions.length - 1) {
      props.setCurrentQuestion(props.currentQuestion + 1);
    }
  };

  const renderCurrentQuestion = () => {
    const question = questions[props.currentQuestion];
    if (question) {
      const selectedOption = props.selectedOptions[question.key];

      return (
        <Card key={question.key + 1} className={styles.card}>
          <div>
            <div className={styles.heading}>
              <div>
                <span style={{ color: "red" }}>*</span>
                Question ID {question.key + 1}
              </div>
              <div className={styles.mark}>{question.marks} Mark(s)</div>
            </div>
            <div className={styles.quizbox}>
              <div id={styles.question}>{question.questionDesc}</div>
              <div id={styles.optionsContainer}>
                {question.option.map((opt) => (
                  <label key={opt.optionId} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={`option_${question.id}`}
                      className={styles.optionRadio}
                      value={opt.optionDescription}
                      checked={selectedOption === opt.optionId}
                      onChange={() =>
                        handleSelectOption(
                          question.key + 1,
                          question.id,
                          opt.optionId,
                          opt.is_answer,
                          question.marks
                        )
                      }
                    />
                    <span className={styles.optionText}>
                      {opt.optionDescription}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={styles.main}>
      {renderCurrentQuestion()}
      <div className={styles.buttonContainer}>
        {props.currentQuestion !== questions.length - 1 && (
          <Button
            type="primary"
            onClick={handleNext}
            disabled={!props.selectedOptions[props.currentQuestion]}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export default Questions;
