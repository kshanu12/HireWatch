import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";

export const getQuestionsByTestId = async (test_id) => {
    // console.log("TEST_ID",test_id);
  const response = await axios
    .get(`${DEPLOYED_URL}/question/test/${test_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const addQuizQuestions = async (quizQuestions) => {
  // console.log("TEST_ID", quizQuestions);
  const response = await axios
    .post(`${DEPLOYED_URL}/question/test/`,{quizQuestions})
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};