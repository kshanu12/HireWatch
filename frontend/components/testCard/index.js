import React from "react";
import styles from "./testcard.module.css";
import { ExclamationCircleOutlined} from "@ant-design/icons"

const ViewCard = ({ data }) => {
  const item = data;

  const getIcon = (teachstack) => {
    switch (teachstack) {
      case "React":
        return "/image/React.png";
      case "Next":
        return "/image/Next.png";
      case "Angular":
        return "/image/Angular.png";
      case "Node":
        return "/image/Node.png";
      case "Nest":
        return "/image/Nest.png";
      default:
        return "";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "orange";
      case "Hard":
        return "red";
      default:
        return "black";
    }
  };

  const getCardColor = () => {
    switch (item.Teachstack) {
      case "React":
        return "#61DAFB";
      case "Next":
        return "#000000";
      case "Angular":
        return "#DD0031";
      case "Node":
        return "#68A063";
      case "Nest":
        return "#E0234E";
      default:
        return "orange";
    }
  };

  const cardStyle = {
    backgroundColor: getCardColor(),
  };

  const difficultyStyle = {
    backgroundColor: getDifficultyColor(item.difficulty),
  };

  return (
    <div className={styles.card} style={cardStyle}>
      <div className={styles.col}>
        <div className={styles.top}>
          <div className={styles.icon}>
            <img
              src={getIcon(item.Teachstack)}
              alt="icon"
              className={styles.iconImage}
            />
          </div>
          <div className={styles.text}>
            <h4>{item.Teachstack}</h4>
          </div>
          <div className={styles.circle} style={difficultyStyle}>
          <ExclamationCircleOutlined   className={styles.alerticon}/>
          {/* <img src="/image/icon.jpeg" alt="Icon" className={styles.alerticon} /> */}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.up}>
            <h3>Test Name:</h3>
            <p>{item.testname}</p>
          </div>
          <div className={styles.middle}>
            <h3>Duration:</h3>
            <p>{item.duration}</p>
          </div>
          <div className={styles.down}>
            <h3>Score:</h3>
            <p>{item.score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;
