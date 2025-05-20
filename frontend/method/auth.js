import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "@/utils/constants";

export const loginUser = async (email, password) => {
  const response = await axios
    .post(`${DEPLOYED_URL}/auth`, {
      email: email,
      password: password,
    })
    .then((res) => {
      // console.log("login details", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};