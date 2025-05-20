// candidate.js
import React from 'react';
import Sidebar from '@/components/sidebar';
import styles from '../../../styles/analytics.module.css';
import Chart from '@/components/charts/pie';
import LineChart from '@/components/charts/line';
import TestCard from '@/components/testanalyticscard';
import Bar from '@/components/charts/bar';
import Header from '@/components/header';



const Candidate = () => {
  return (
    <div className={styles.pageContainer}>
      <Header/>
        <Sidebar/>
      <div className={styles.maincard}>
        <div className={styles.left}>
            <div className={styles.square}><LineChart /></div>
            <div className={styles.squareT}> 
            <div className={styles.squarep}><Chart /></div> 
            <div className={styles.squarep}><Bar/></div> 
            </div>
            </div>
            <div className={styles.right}>
               <TestCard title="Card Title" content="Card Content" />
            </div>   
          </div>
        </div>
  );
};

export default Candidate;