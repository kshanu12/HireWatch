import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "@/utils/constants";

export const getUserByEmail = async (email, password) => {
  const response = await axios
    .post(`${DEPLOYED_URL}/user/login`, {
      email: email,
      password: password,
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const getCandidates = async (violations, score, test_id, status) => {
  // console.log("filter : ", violations, score, test_id, status);
  const response = await axios
    .post(`${DEPLOYED_URL}/application/filters`, {
      minimumScore: score,
      maximumViolationCount: violations,
      status: status,
      testName: test_id,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const sendMail = async (candidates) => {
  // console.log("----------------",candidates);
  try {
    const response = await axios
      .post(`${DEPLOYED_URL}/user/mail`, {
        candidates
      })
      .then((res) => {
        // console.log("__+_+_+_+_+_+_+ _+_+_+_+_+_+",res);
        return res;
      })
      .catch((error) => {
        return error;
      });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateOneTimePassword = async (applicationId) => {
  try {
    const applicationDetails = await axios.get(
      `${DEPLOYED_URL}/application/${applicationId}`
    );
    const user = await axios
      .patch(`${DEPLOYED_URL}/user/${applicationDetails.data[0].user_id}`, {
        password: "0000O",
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id) => {
  const response = await axios
    .get(`${DEPLOYED_URL}/user/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};