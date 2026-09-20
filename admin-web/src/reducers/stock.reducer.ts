import { stockConstants } from "@/constants/action.constant";
import type { stockAction, stockState } from "@/constants/types";

const initialState: stockState = {
  products: [],
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historyTotalPages: 0,
  selectedCategory: null,
  loading: false,
  historyLoading: false,
  error: null,
  success: false,
};

export default (state: stockState = initialState, action: stockAction) => {
  switch (action.type) {
    case stockConstants.GET_STOCK_PRODUCTS_REQUEST:
    case stockConstants.CREATE_STOCK_ENTRY_REQUEST:
      state = { ...state, loading: true, error: null, success: false };
      break;
    case stockConstants.GET_STOCK_PRODUCTS_SUCCESS:
      state = { ...state, loading: false, products: action.payload };
      break;
    case stockConstants.GET_STOCK_PRODUCTS_FAILURE:
    case stockConstants.CREATE_STOCK_ENTRY_FAILURE:
      state = { ...state, loading: false, error: action.payload };
      break;
    case stockConstants.GET_STOCK_HISTORY_REQUEST:
      state = { ...state, historyLoading: true, error: null };
      break;
    case stockConstants.GET_STOCK_HISTORY_SUCCESS:
      state = { 
        ...state, 
        historyLoading: false, 
        history: action.payload.entries, 
        historyTotal: action.payload.total,
        historyPage: action.payload.currentPage,
        historyTotalPages: action.payload.totalPages,
      };
      break;
    case stockConstants.GET_STOCK_HISTORY_FAILURE:
      state = { ...state, historyLoading: false, error: action.payload };
      break;
    case stockConstants.CREATE_STOCK_ENTRY_SUCCESS:
      state = { ...state, loading: false, success: true };
      break;
    case stockConstants.SET_SELECTED_CATEGORY:
      state = { 
        ...state, 
        selectedCategory: action.payload, 
        products: [], 
        history: [],
        success: false, 
        error: null 
      };
      break;
    default:
      break;
  }
  return state;
};
