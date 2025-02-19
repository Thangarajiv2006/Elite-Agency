import { shopConstant } from '../actions/constants';

const initialState = {
  shops: [],
  isEnded: false,
  isLoading: false,
  errorCode: null,
  errorMessage: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case shopConstant.CREATE_SHOP_REQUEST:
      state = {
        ...state,
        isLoading: true,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case shopConstant.CREATE_SHOP_FAILURE:
      state = {
        ...state,
        isLoading: false,
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      };
      break;
    case shopConstant.CREATE_SHOP_SUCCESS:
      state = {
        ...state,
        shops: [action.payload, ...state.shops],
        isLoading: false,
        errorCode: null,
        errorMessage: '',
      };
      break;
    case shopConstant.CREATE_WORKER_AXIOS_ERROR:
      state = {
        ...state,
        isLoading: false,
      };
      break;
  }
  return state;
};
