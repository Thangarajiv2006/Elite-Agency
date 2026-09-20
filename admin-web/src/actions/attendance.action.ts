import { attendanceConstants } from "@/constants/action.constant";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const fetchAttendance = (workerId: string, month: number, year: number) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: attendanceConstants.FETCH_ATTENDANCE_REQUEST });
    try {
      const res = await axios.get(`/attendance/${workerId}?month=${month}&year=${year}`);
      if (res?.data.success) {
        dispatch({
          type: attendanceConstants.FETCH_ATTENDANCE_SUCCESS,
          payload: res.data.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: attendanceConstants.FETCH_ATTENDANCE_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };
};

export const logAttendance = (attendanceData: {
  workerId: string;
  date: string;
  status: string;
  note?: string;
}) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: attendanceConstants.LOG_ATTENDANCE_REQUEST });
    try {
      const res = await axios.post("/attendance", attendanceData);
      if (res?.data.success) {
        dispatch({
          type: attendanceConstants.LOG_ATTENDANCE_SUCCESS,
          payload: res.data.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: attendanceConstants.LOG_ATTENDANCE_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    }
  };
};
