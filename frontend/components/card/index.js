import React from 'react';

import styles from './card.module.css';


const Card = ({ title, description, children }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardtitle}>{title}</h2>
      <p className={styles.carddescription}>{description}</p>
      {children}
    </div>
  );
};

export default Card;