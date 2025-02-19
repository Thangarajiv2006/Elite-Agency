import { categoryConstants } from '../actions/constants';

const initialData = {
  categories: [],
  isLoading: false,
  errorCode: null,
  errorMessage: '',
};

export default (state = initialData, action) => {
  switch (action.type) {
    case categoryConstants.CREATE_CATEGORY_REQUEST:
      state = {
        ...state,
        isLoading: true,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case categoryConstants.CREATE_CATEGORY_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        categories: [action.payload, ...state.categories],
        errorCode: null,
        errorMessage: '',
      };
      break;
    case categoryConstants.CREATE_CATEGORY_FAILURE:
      state = {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
    case categoryConstants.GET_ALL_WORKER_REQUEST:
      state = {
        ...state,
        isLoading: true,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case categoryConstants.GET_ALL_WORKER_SUCCESS:
      state = {
        ...state,
        isLoading: false,
        errorCode: null,
        errorMessage: '',
        categories: action.payload,
      };
      break;
    case categoryConstants.GET_ALL_WORKER_FAILURE:
      state = {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
  }

  return state;
};
