import { workerConstant } from '../actions/constants';

const initialData = {
  workers: [],
  isEnded: false,
  isLoading: false,
  errorCode: null,
  errorMessage: '',
};

const deactiveWorker = (state, workerId) => {
  let element = state.find((data) => data._id === workerId);
  const index = state.indexOf(element);
  element.isWorked = !element.isWorked;
  state[index] = element;
  return state;
};

export default (state = initialData, action) => {
  switch (action.type) {
    case workerConstant.CREATE_WORKER_REQUEST:
      state = {
        ...state,
        isLoading: true,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case workerConstant.CREATE_WORKER_FAILURE:
      state = {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
    case workerConstant.CREATE_WORKER_SUCCESS:
      state = {
        ...state,
        workers: [action.payload, ...state.workers],
        isLoading: false,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case workerConstant.CREATE_WORKER_AXIOS_ERROR:
      state = {
        ...state,
        isLoading: false,
      };
      break;
    case workerConstant.GET_WORKER_REQUEST:
      state = {
        ...state,
        isEnded: false,
        isLoading: true,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case workerConstant.GET_WORKER_FAILURE:
      state = {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
    case workerConstant.GET_WORKER_SUCCESS:
      state = {
        ...state,
        workers: [...state.workers, ...action.payload],
        isLoading: false,
        errorCode: '',
        errorMessage: '',
        isEnded: action.payload.length ? false : true,
      };
      break;
    case workerConstant.DEACTIVE_WORKER_FAILURE:
      state = {
        ...state,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
    case workerConstant.DEACTIVE_WORKER_SUCCESS:
      state = {
        ...state,
        workers: deactiveWorker(state.workers, action.payload.workerId),
      };
      break;
    case workerConstant.GET_WORKER_AXIOS_ERROR:
      state = {
        ...state,
        isLoading: false,
        errorCode: '400',
        errorMessage: 'Sorry Somthing Wrong!',
      };
      break;
  }
  return state;
};
