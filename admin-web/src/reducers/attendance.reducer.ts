import { attendanceConstants } from "@/constants/action.constant";

interface AttendanceState {
  logs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  logs: [],
  loading: false,
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case attendanceConstants.FETCH_ATTENDANCE_REQUEST:
    case attendanceConstants.LOG_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case attendanceConstants.FETCH_ATTENDANCE_SUCCESS:
      return {
        ...state,
        logs: action.payload,
        loading: false,
        error: null,
      };
    case attendanceConstants.LOG_ATTENDANCE_SUCCESS:
      // Update existing log or add new one
      const updatedLogs = [...state.logs];
      const index = updatedLogs.findIndex(
        (log) => 
          new Date(log.date).toDateString() === new Date(action.payload.date).toDateString()
      );
      if (index !== -1) {
        updatedLogs[index] = action.payload;
      } else {
        updatedLogs.push(action.payload);
      }
      return {
        ...state,
        logs: updatedLogs,
        loading: false,
        error: null,
      };
    case attendanceConstants.FETCH_ATTENDANCE_FAILURE:
    case attendanceConstants.LOG_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
