import axios from "axios";
import { DEPLOYED_URL, LOCAL_URL } from "../utils/constants";
import { Log } from "@tensorflow/tfjs-core";

export const getApplicationById = async (application_id) => {
  const response = await axios
    .get(`${DEPLOYED_URL}/application/${application_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationById = async (id, status_id, action_id) => {
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      application_status_id: status_id,
      application_action_id: action_id,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationBroadcasterId = async (id, broadcast_id) => {
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      broadcast_id: broadcast_id,
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationStartTime = async (id, start_time) => {
  // console.log("UpdateAPplicationById : ", id, broadcast_id);
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      started_at: start_time,
    })
    .then((res) => {
      // console.log("RESULTSSS", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationEndTime = async (id, end_time) => {
  // console.log("UpdateAPplicationById : ", id, broadcast_id);
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      ended_at: end_time,
    })
    .then((res) => {
      // console.log("RESULTSSS", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationAcceptRejectStatus = async (id, statusId) => {
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      application_status_id: statusId,
    })
    .then((res) => {
      // console.log("RESULTSSS", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateApplicationScore = async (id, score) => {
  // console.log("UpdateAPplicationById : ", id, broadcast_id);
  const response = await axios
    .patch(`${DEPLOYED_URL}/application`, {
      application_id: id,
      score: score,
    })
    .then((res) => {
      // console.log("RESULTSSS", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};

export const updateAllApplication = async (candidates, status) => {
  // console.log("----------",candidates,status);
  const response = await axios
    .post(`${DEPLOYED_URL}/application/updateAll`, {
      candidates,
      status,
    })
    .then((res) => {
      // console.log("RESULTSSS", res);
      return res;
    })
    .catch((error) => {
      return error;
    });
  return response;
};
