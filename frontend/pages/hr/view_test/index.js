import React, { useEffect, useState } from "react";
import styles from "../../../styles/viewtest.module.css";
import Header from "@/components/header";
import ViewCard from "@/components/testCard";
import Sidebar from "@/components/sidebar";
import { getTestByCreatorId } from "@/method/test";
import Router, { useRouter } from "next/router";

const ViewTest = () => {
  const router = useRouter();
  // console.log("ROUTER : ",router);

  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      if (router.query.id) {
        const res = await getTestByCreatorId(router.query.id);
        const transformedTests = res.map((test) => ({
          Teachstack: test.tech_stack.name,
          testname: test.name,
          duration: `${test.duration} minutes`,
          score: test.score,
        }));
        setTests(transformedTests);
      }
    };
    fetchTests();
  }, [router.query.id]);

  const jsonData = { data: tests }

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
      <Sidebar></Sidebar>
      <div className={styles.main}>
        <div className={styles.grid}>
          {currentCards.map((item, index) => (
            <ViewCard data={item} key={index} />
          ))}
        </div>
        <div className={styles.pagination}>
          <button
            className={currentPage === 1 ? "disabled" : ""}
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            &lt;
          </button>
          <p>{currentPage}</p>
          <button
            className={endIndex >= jsonData.data.length ? "disabled" : ""}
            disabled={endIndex >= jsonData.data.length}
            onClick={goToNextPage}
          >
            {" "}
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTest;