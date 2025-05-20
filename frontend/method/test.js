import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "@/utils/constants";

export const getAllTests = async () => {
  const response = await axios
    .get(`${DEPLOYED_URL}/test/`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const getTestById = async (id) => {
  const response = await axios
    .get(`${DEPLOYED_URL}/test/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const getTestByCreatorId = async (creator_id) => {
  // console.log("CREATOR ID",creator_id);
  const response = await axios
    .get(`${DEPLOYED_URL}/test/creator/${creator_id}`)
    .then((res) => {
      // console.log(res);
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};