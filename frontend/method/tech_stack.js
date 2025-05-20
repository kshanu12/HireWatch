import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";

export const getAllTechStack = async () => {
  const response = await axios
    .get(`${DEPLOYED_URL}/tech_stack/`)
      .then((res) => {
        // console.log("TECH STACK",res);
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};
