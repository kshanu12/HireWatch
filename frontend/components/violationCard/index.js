import React from 'react';
import styles from './violationCard.module.css';
import ScoreMeter from '../scoreMeter';

const ViolationCard = ({ data }) => {
  return (
    <div className={styles.mainCard}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div className={styles.cardItem}>
            {item.icon === 'name' ? (
              <div className={styles.iconbg}>
                <img src="/image/user1.png" alt="Name Icon" />
              </div>
            ) : item.icon === 'techstack' ? (
              <div className={styles.iconbg}>
                <img src="/image/techstack.png" alt="Name Icon" />
              </div>
            ) : item.icon === 'test' ? (
              <div className={styles.iconbg}>
                <img src="/image/testname.png" alt="Name Icon" />
              </div>
            ) : item.icon === 'duration' ? (
              <div className={styles.iconbg}>
                <img src="/image/duration.png" alt="Name Icon" />
              </div>
            ) : item.icon === 'score1' ? (
              <ScoreMeter title={item.value}/>
            ) : item.icon === 'score2' ? (
              <div className={styles.iconbg}>
                <img src="/image/score.png" alt="Name Icon" />
              </div>
            ) : null}
            {item.icon === 'score1' ?
              <div className={styles.details}>
                <span className={styles.attribute}>{item.title}</span>
              </div> :
              <div className={styles.details}>
                <span className={styles.attribute}>{item.title}</span>
                <span className={styles.values}>{item.value}</span>
              </div>
            }
          </div>
          {index < data.length - 1 && <hr className={styles.separator} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ViolationCard;
