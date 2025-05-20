import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";
import { Language } from "@material-ui/icons";

export const compileCandidateCode = async (language, script, stdin) => {
  // console.log(language, script, stdin);
  const response = await axios
    .post(`${DEPLOYED_URL}/compile`, {
      language: language,
      script: script,
      stdin: stdin,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });

  return response;
};
