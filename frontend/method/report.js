import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";

export const addCandidateResponse = async (candidateResponse) => {
  const response = await axios
      .post(`${DEPLOYED_URL}/report/`, {
        candidateResponse
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const getCandidateResponse = async (application_id) => {
  const response = await axios
    .get(`${DEPLOYED_URL}/report/application/${application_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};