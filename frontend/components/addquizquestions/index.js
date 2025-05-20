import { useState } from "react";
import styles from "./quizquestions.module.css";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

const QuestionCard = ({
  question,
  marks,
  options,
  answer,
  questionNumber,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.quizCard}>
      <div className={styles.btnC}>
        <button className={styles.editbtnC} onClick={onEdit}>
          <EditFilled />
        </button>
        <button className={styles.deletebtnC} onClick={onDelete}>
          <DeleteFilled />
        </button>
      </div>
      <div className={styles.attributesC}>
        <h1>Question {questionNumber}:</h1>
        <div className={styles.showmarks}>Marks : {marks}</div>
        <textarea className={styles.quest}>{question}</textarea>
      </div>
      <div className={styles.attributesC}>
        <div className={styles.showopt}>
          {options.map((option, index) => (
            <li key={index}>
              <span style={{ fontWeight: "500" }}>Option {index + 1}:</span>{" "}
              {option}
            </li>
          ))}
        </div>
      </div>
      <div className={styles.ansAttribute}>
        <h3>Answer:</h3>
        <div className={styles.ansText}>{answer}</div>
        {/* <textarea className={styles.ans}>{answer}</textarea> */}
      </div>
    </div>
  );
};

const AddQuizQuestion = (props) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [marks, setMarks] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state variable for error message

  const handleQuestionChange = (e) => {
    if (e.target.name === "question") {
      setNewQuestion(e.target.value);
    } else if (e.target.name === "answer") {
      setNewAnswer(e.target.value);
    } else if (e.target.name === "marks") {
      // Handle marks input
      setMarks(e.target.value);
    }
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = e.target.value;
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = () => {
    if (
      !newQuestion ||
      newOptions.some((option) => !option) ||
      !newAnswer ||
      !marks
    ) {
      setErrorMessage("* Please fill in all fields."); // Update the error message
      return;
    }

    // Reset the error message if all fields are filled
    setErrorMessage("");

    const question = {
      question: newQuestion,
      options: newOptions.map((option) => option),
      answer: newAnswer,
      marks: marks,
    };

    if (editQuestionIndex !== null) {
      const updatedQuestions = [...props.quizQuestions];
      updatedQuestions[editQuestionIndex] = question;
      props.setQuizQuestions(updatedQuestions);
      setEditQuestionIndex(null);
    } else {
      props.setQuizQuestions([...props.quizQuestions, question]);
    }

    setNewQuestion("");
    setNewOptions(["", ""]);
    setNewAnswer("");
    setMarks("");
  };

  const handleEditQuestion = (index) => {
    const selectedQuestion = props.quizQuestions[index];
    setNewQuestion(selectedQuestion.question);
    setNewOptions(selectedQuestion.options);
    setNewAnswer(selectedQuestion.answer);
    setMarks(selectedQuestion.marks);
    setEditQuestionIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...props.quizQuestions];
    updatedQuestions.splice(index, 1);
    props.setQuizQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...newOptions, ""];
    setNewOptions(updatedOptions);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...newOptions];
    updatedOptions.splice(index, 1);
    setNewOptions(updatedOptions);

    if (newAnswer === newOptions[index]) {
      setNewAnswer("");
    }
  };



  return (
    <div className={styles.outerContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.titleT}>
          <h1>Current Questions</h1>
        </div>
        <hr className={styles.line} />
        {props.quizQuestions.length === 0 ? (
          <div className={styles.noQuestion}>
            <img
              src="/image/noquestion.png"
              width={500}
              height={400}
              alt="No questions"
            />
            <p>No questions available.</p>
          </div>
        ) : (
          <>
            {props.quizQuestions.map((question, index) => (
              <div className={styles.content} key={index}>
                <QuestionCard
                  question={question.question}
                  options={question.options}
                  answer={question.answer}
                  marks={question.marks}
                  questionNumber={index + 1}
                  onEdit={() => handleEditQuestion(index)}
                  onDelete={() => handleDeleteQuestion(index)}
                />
              </div>
            ))}
            <button onClick={props.handleSubmit} className={styles.submitButton}>
              Submit
            </button>
          </>
        )}
      </div>
      <hr className={styles.vertline} />
      <div className={styles.rightContainer}>
        <div className={styles.title}>
          <h1>Question</h1>
          <button className={styles.addquest} onClick={handleAddQuestion}>
            {editQuestionIndex !== null ? "Update" : "Add +"}
          </button>
        </div>
        <hr className={styles.line} />
        <div>
          <div className={styles.attributes}>
            <label htmlFor="question">Question:</label>
            <textarea
              className={styles.inputT}
              type="text"
              id="question"
              name="question"
              value={newQuestion}
              onChange={handleQuestionChange}
            />
            <div className={styles.optionsection}>
              <h3 className={styles.option}>Options</h3>
              <button className={styles.addopt} onClick={handleAddOption}>
                Add +
              </button>
            </div>
            <hr className={styles.line} />
            {newOptions.map((option, index) => (
              <div className={styles.attributes} key={index}>
                <label htmlFor={`option${index + 1}`}>
                  Option {index + 1}:
                </label>
                <div className={styles.demo}>
                  <textarea
                    className={styles.input}
                    type="text"
                    id={`option${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                  />
                  {newOptions.length > 2 && (
                    <button
                      className={styles.removebtn}
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <label htmlFor="answer">Answer:</label>
              <label className={styles.marksText} htmlFor="answer">
                Marks:
              </label>
            </div>
            <div className={styles.markcontainer}>
              <select
                className={styles.select}
                id="answer"
                name="answer"
                value={newAnswer}
                onChange={handleQuestionChange}
              >
                <option value="" disabled>Select Answer</option>
                {newOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={styles.marks}
                name="marks" // Add name attribute
                value={marks}
                onChange={handleQuestionChange} // Use handleQuestionChange for onChange
              />
            </div>
          </div>
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AddQuizQuestion;
