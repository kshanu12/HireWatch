import styles from "./codingQuestions.module.css";
import { useState } from "react";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

const QuestionCard = ({ question, marks, sampleInput, sampleOutput, onEdit, onDelete }) => {
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
                <h1>Question:</h1>
                <div className={styles.showmarks}>Marks : {marks}</div>
                <textarea className={styles.quest} disabled value={question} />
            </div>
            <div className={styles.attributesC}>
                <h1>Sample Input</h1>
                <textarea className={styles.ans} disabled value={sampleInput} />
            </div>
            <div className={styles.attributesC}>
                <h1>Sample Output</h1>
                <textarea className={styles.ans} disabled value={sampleOutput} />
            </div>
        </div>
    );
};

const AddCodingQuestion = ({ question: existingQuestion, sampleInput: existingSampleInput, sampleOutput: existingSampleOutput, marks: existingMarks }) => {
    const [question, setQuestion] = useState(existingQuestion || "");
    const [sampleInput, setSampleInput] = useState(existingSampleInput || "");
    const [sampleOutput, setSampleOutput] = useState(existingSampleOutput || "");
    const [marks, setMarks] = useState(existingMarks || "");
    const [isQuestionAdded, setIsQuestionAdded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleQuestionChange = (e) => {
        if (e.target.name === "question") {
            setQuestion(e.target.value);
        } else if (e.target.name === "sampleInput") {
            setSampleInput(e.target.value);
        } else if (e.target.name === "sampleOutput") {
            setSampleOutput(e.target.value);
        } else if (e.target.name === "marks") {
            setMarks(e.target.value);
        }
    };

    const handleAddQuestion = () => {
        if (!question || !sampleInput || !sampleOutput || !marks) {
            setErrorMessage("* Please fill all the fields.");
            return;
        }

        setIsQuestionAdded(true);
        setErrorMessage("");
    };

    const handleEditQuestion = () => {
        setIsQuestionAdded(false);
        if (!question) {
            setQuestion(existingQuestion);
        }
        if (!sampleInput) {
            setSampleInput(existingSampleInput);
        }
        if (!sampleOutput) {
            setSampleOutput(existingSampleOutput);
        }
        if (!marks) {
            setMarks(existingMarks);
        }
        setErrorMessage("");
    };

    const handleDeleteQuestion = () => {
        setIsQuestionAdded(false);
        setQuestion("");
        setSampleInput("");
        setSampleOutput("");
        setMarks("");
        setErrorMessage("");
    };

    const handleSampleInputChange = (e) => {
        setSampleInput(e.target.value);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.titleT}>
                    <h1>Current Questions</h1>
                </div>
                <hr className={styles.line} />
                <div className={styles.content}>
                    {isQuestionAdded ? (
                        <QuestionCard
                            question={question}
                            sampleInput={sampleInput}
                            sampleOutput={sampleOutput}
                            marks={marks}
                            onEdit={handleEditQuestion}
                            onDelete={handleDeleteQuestion}
                        />
                    ) : (
                        <div className={styles.noQuestion}>
                            <img src="/image/noquestion.png" width={500} height={400} alt="No questions" />
                            <p>No questions available.</p>
                        </div>
                    )}
                </div>
            </div>
            <hr className={styles.vertline} />
            <div className={styles.rightContainer}>
                <div className={styles.title}>
                    <h1>Question</h1>
                    {!isQuestionAdded && (
                        <button className={styles.addquest} onClick={handleAddQuestion}>
                            Add +
                        </button>
                    )}
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
                            value={question}
                            onChange={handleQuestionChange}
                            disabled={isQuestionAdded}
                            required
                        />
                    </div>
                    <div className={styles.fields}>
                        <div className={styles.sample}>
                            <label htmlFor="sampleInput">Sample Input:</label>
                            <textarea
                                className={styles.ans}
                                type="text"
                                id="sampleInput"
                                name="sampleInput"
                                value={sampleInput}
                                onChange={handleSampleInputChange}
                                disabled={isQuestionAdded}
                                required
                            />
                        </div>
                        <div className={styles.sample}>
                            <label htmlFor="sampleOutput">Sample Output:</label>
                            <textarea
                                className={styles.ans}
                                type="text"
                                id="sampleOutput"
                                name="sampleOutput"
                                value={sampleOutput}
                                onChange={handleQuestionChange}
                                disabled={isQuestionAdded}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.marksContainer}>
                        <label className={styles.marksText} htmlFor="marks">Marks:</label>
                        <input
                            type="text"
                            className={styles.marks}
                            name="marks"
                            value={marks}
                            onChange={handleQuestionChange}
                            disabled={isQuestionAdded}
                            required
                        />
                    </div>
                    {errorMessage && (
                        <p className={styles.errorMessage}>{errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCodingQuestion;
