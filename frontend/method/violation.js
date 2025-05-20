import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "@/utils/constants";

export const getViolationByApplicationId = async (application_id) => {
  const response = await axios
    .get(`${DEPLOYED_URL}/violation/${application_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const addViolationByApplicationId = async (
  applicationId,
  type,
  image
) => {
  const response = await axios
    .post(
      `${DEPLOYED_URL}/violation/`, {
        type: type,
        image: image,
        application_id: applicationId,
      }
    )
    .then((res) => {})
    .catch((error) => {
      return error;
    });

  return response;
};
