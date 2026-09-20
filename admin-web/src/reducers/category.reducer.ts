import { categoryConstants } from "@/constants/action.constant";
import type { categoryAction, categoryState } from "@/constants/types";

const initialState: categoryState[] = [];

export default (state = initialState, action: categoryAction) => {
  switch (action.type) {
    case categoryConstants.CREATE_CATEGORY_SUCCESS:
      return [...state, action.payload];
    case categoryConstants.GET_CATEGORIES_SUCCESS:
      return action.payload;
    case categoryConstants.DELETE_CATEGORY_SUCCESS:
      return state.filter((category) => category._id !== action.payload._id);
    default:
      return state;
  }
};
