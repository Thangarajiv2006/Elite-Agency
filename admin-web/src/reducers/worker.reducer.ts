import { workerConstants } from "@/constants/action.constant";
import type { WorkerAction, WorkerState } from "@/constants/types";

const initialData: WorkerState[] = [];

export default (state = initialData, action: WorkerAction) => {
  console.log(action.type);
  switch (action.type) {
    case workerConstants.GET_WORKER_SUCCESS:
      state = action.payload;
      break;
    case workerConstants.WORKER_CREATED_SUCCESS:
      state = [...state, action.payload];
      break;
    case workerConstants.WORKER_UPDATED_SUCCESS:
      state = state.map((worker) =>
        worker._id === action.payload._id ? action.payload : worker,
      );
      break;
    case workerConstants.WORKER_DELETED_SUCCESS:
      state = state.filter((worker) => worker._id !== action.payload);
      break;
    default:
      break;
  }
  return state;
};
