import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";

export const dbInit = async (test_id) => {
  const response = await axios
    .post(`${DEPLOYED_URL}/db_init`, {
      query:
        `SELECT SUM(marks) AS total_marks FROM questions WHERE test_id = '${test_id}';`,
    })
      .then((res) => {
        // console.log(res);
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};
