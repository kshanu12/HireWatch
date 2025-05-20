import React, { useState, useEffect } from "react";
import compileCode from "@/components/compiler";
import Sidecard from "@/components/sidecard";
import Header from "@/components/header";
import styles from "../../../../styles/coding.module.css";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(import("@/components/codeEditor/index"), {
  ssr: false,
});

const CodingId = () => {
  const [code, setCode] = useState("");
  const [stdin, setStdin] = useState("");
  const [compiledOutput, setCompiledOutput] = useState("");

  const handleCodeCompilation = async () => {
    const response = await compileCode("python3", code, stdin);
    // console.log(response);
    setCompiledOutput(response.data.output);
  };
  // console.log("====", compiledOutput);

  const handleStdinChange = (event) => {
    setStdin(event.target.value);
  };

  const handleRunClick = () => {
    handleCodeCompilation();
  };

  //console.log("code", code);

  return (
    <div className={styles.mainPage}>
      <Header />
      <Sidecard />
      <div className={styles.cardcontainer}>
        <div className={styles.textViewer}>
          <h3>Question</h3>
          <p>Write a function to calculate the factorial of a given number.</p>
          <br />
          <h4>Sample Input:</h4>
          <pre>5</pre>
          <br />
          <h4>Sample Output:</h4>
          <pre>120</pre>
        </div>
        <div className={styles.ideContainer}>
          <div className={styles.title}>
            <h1>Compiler</h1>
            <div className={styles.head}>
              <div className={styles.languageContainer}>
                <label>Language:</label>
                <div className={styles.lang}>Python</div>
              </div>
              <button onClick={handleRunClick} className={styles.Rbutton}>
                Run
              </button>
            </div>
            <div className={styles.ide}>
              <CodeEditor setCode={setCode} />
            </div>

            <div className={styles.bottom}>
              <div className={styles.input}>
              <h3 className={styles.compiled}>Input:</h3>
                <textarea
                  className={styles.text}
                  value={stdin}
                  onChange={handleStdinChange}
                  rows={20}
                ></textarea>
              </div>
              <div className={styles.output}>
              <h3 className={styles.compiled}>Compiled Output:</h3>
                <div className={styles.text} >{compiledOutput}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingId;
