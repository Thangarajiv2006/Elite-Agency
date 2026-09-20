import { productConstants } from "@/constants/action.constant";
import type { productAction, productState } from "@/constants/types";

const initialState: productState = {
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 0,
  quriedProducts: 0,
};

export default (state: productState = initialState, action: productAction) => {
  switch (action.type) {
    case productConstants.CREATE_PRODUCT_SUCCESS:
      state = {
        ...state,
        products: [action.payload, ...state.products],
        totalProducts: state.totalProducts + 1,
        currentPage: state.currentPage,
        totalPages: Math.ceil(
          (state.totalProducts + 1) / productConstants.QUERY_PER_PAGE,
        ),
        quriedProducts: state.quriedProducts + 1,
      };
      break;
    case productConstants.GET_PRODUCTS_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.total, // Always the total products in category
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        quriedProducts: action.payload.queriedTotal,
      };
      break;
    case productConstants.PRODUCT_UPDATED_SUCCESS:
      state = {
        ...state,
        products: state.products.map((p) =>
          p._id === action.payload._id ? { ...p, ...action.payload } : p,
        ),
      };
      break;
    case productConstants.PRODUCT_DELETED_SUCCESS:
      state = {
        ...state,
        products: state.products.filter((p) => p._id !== action.payload),
        totalProducts: state.totalProducts - 1,
      };
      break;
    default:
      break;
  }
  return state;
};
