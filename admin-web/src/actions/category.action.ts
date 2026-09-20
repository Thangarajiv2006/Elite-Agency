import { categoryConstants } from "@/constants/action.constant";
import type { categoryState } from "@/constants/types";
import axios from "@/helpers/axios";

export const createCategory = (category: categoryState) => {
  return async (dispatch: any) => {
    try {
      const res = await axios.post("/category", category);
      if (res.data.status === "success") {
        dispatch({
          type: categoryConstants.CREATE_CATEGORY_SUCCESS,
          payload: res.data.category,
        });
      }
      return res;
    } catch (err) {
      console.log(err);
    }
  };
};

export const getCategories = () => {
  return async (dispatch: any) => {
    try {
      const res = await axios.get("/category");
      if (res.data.status === "success") {
        dispatch({
          type: categoryConstants.GET_CATEGORIES_SUCCESS,
          payload: res.data.categories,
        });
      }
      return res;
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteCategory = (id: string) => {
  return async (dispatch: any) => {
    try {
      const res = await axios.delete(`/category/${id}`);
      if (res.data.status === "success") {
        dispatch({
          type: categoryConstants.DELETE_CATEGORY_SUCCESS,
          payload: {
            _id: id,
          },
        });
      }
      return res;
    } catch (err) {
      console.log(err);
    }
  };
};
