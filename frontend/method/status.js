import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "@/utils/constants";

export const getAllStatus = async () => {
  const response = await axios
    .get(
      `${DEPLOYED_URL}/application_status/`
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};
