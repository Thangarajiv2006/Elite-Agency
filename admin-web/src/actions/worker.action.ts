import { workerConstants } from "@/constants/action.constant";
import type { WorkerState } from "@/constants/types";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const getWorkers = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get("/worker");
      if (res.data.status === "success") {
        dispatch({
          type: workerConstants.GET_WORKER_SUCCESS,
          payload: res.data.worker,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const createWorker = (data: WorkerState) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post("/worker", data);
      if (res.data.status === "success") {
        dispatch({
          type: workerConstants.WORKER_CREATED_SUCCESS,
          payload: res.data.worker,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const updateWorker = (data: WorkerState) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.put(`/worker`, data);
      if (res.data.status === "success") {
        dispatch({
          type: workerConstants.WORKER_UPDATED_SUCCESS,
          payload: data,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const deleteWorker = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.delete(`/worker/${id}`);
      if (res.data.status === "success") {
        dispatch({
          type: workerConstants.WORKER_DELETED_SUCCESS,
          payload: id,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};
