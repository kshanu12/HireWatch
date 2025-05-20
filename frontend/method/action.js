import axios from "axios";
import {DEPLOYED_URL, LOCAL_URL } from "../utils/constants";

export const getAllAction = async () => {
  const response = await axios
    .get(`${DEPLOYED_URL}/application_action/`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};
