import React, { useState } from 'react';
import styles from '../../../styles/viewtest.module.css';
import Header from '@/components/header';
import ViewCard from '@/components/testCard';
import LeaderSidebar from '@/components/leadersidebar';

const ViewTest = () => {
  // JSON data
  const jsonData = {
    "data": [
      {
        "Teachstack": "React",
        "testname": "React Quiz",
        "duration": "30 minutes",
        "score": 85,
        "difficulty":"Easy",
      },
      {
        "Teachstack": "Next",
        "testname": "Next Basics",
        "duration": "45 minutes",
        "score": 92,
        "difficulty":"Hard",
        
      },
      {
        "Teachstack": "Angular",
        "testname": "Angular quiz",
        "duration": "20 minutes",
        "score": 78,
        "difficulty":"Medium",
      },
      {
        "Teachstack": "Node",
        "testname": "Node Basics",
        "duration": "25 minutes",
        "score": 90,
        "difficulty":"Medium",
      },
      {
        "Teachstack": "React",
        "testname": "React Components",
        "duration": "60 minutes",
        "score": 88,
        "difficulty":"Hard",
      },
      {
        "Teachstack": "Nest",
        "testname": "Nest Basics",
        "duration": "40 minutes",
        "score": 79,
        "difficulty":"Easy",
      }, {
        "Teachstack": "React",
        "testname": "React Quiz",
        "duration": "30 minutes",
        "score": 85,
        "difficulty":"Medium",
      },
      {
        "Teachstack": "Next",
        "testname": "Next Basics",
        "duration": "45 minutes",
        "score": 92,
        "difficulty":"Hard",
      },
      {
        "Teachstack": "Angular",
        "testname": "Angular quiz",
        "duration": "20 minutes",
        "score": 78,
        "difficulty":"Easy",
      }
    ]
  };

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Get the cards to be displayed on the current page
  const currentCards = jsonData.data.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <LeaderSidebar></LeaderSidebar>
      <div className={styles.main}>
        <div className={styles.grid}>
          {currentCards.map((item, index) => (
            <ViewCard data={item} key={index} />
          ))}
        </div>
        <div className={styles.pagination}>
  <button
    className={currentPage === 1 ? 'disabled' : ''}
    disabled={currentPage === 1}
    onClick={goToPreviousPage}
  >
    &lt;
  </button>
  <p>{currentPage}</p>
  <button
    className={endIndex >= jsonData.data.length ? 'disabled' : ''}
    disabled={endIndex >= jsonData.data.length}
    onClick={goToNextPage}
  > &gt;
  </button>
</div>
      </div>
    </div>
  );
};

export default ViewTest;