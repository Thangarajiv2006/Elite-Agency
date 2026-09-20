import { stockConstants } from "@/constants/action.constant";
import type { Dispatch } from "redux";
import axios from "@/helpers/axios";

export const fetchProductsByCategory = (categoryId: string, search: string = "") => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: stockConstants.GET_STOCK_PRODUCTS_REQUEST });
    try {
      const params = new URLSearchParams();
      params.append("categoryId", categoryId);
      params.append("limit", "1000"); // Fetch broadly to facilitate bulk stock assignments globally
      if (search) params.append("search", search);

      const res = await axios.get(`/product?${params.toString()}`);
      if (res?.data?.status === "success") {
        dispatch({
          type: stockConstants.GET_STOCK_PRODUCTS_SUCCESS,
          payload: res.data.products,
        });
      } else {
        dispatch({
          type: stockConstants.GET_STOCK_PRODUCTS_FAILURE,
          payload: res.data?.message || "Failed to fetch products for stock",
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: stockConstants.GET_STOCK_PRODUCTS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const createCategoryStockEntry = (payload: { categoryId: string, products: { productId: string, quantity: number }[] }) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: stockConstants.CREATE_STOCK_ENTRY_REQUEST });
    try {
      const res = await axios.post("/stock/category", payload);
      if (res?.data?.success) {
        dispatch({
          type: stockConstants.CREATE_STOCK_ENTRY_SUCCESS,
        });
      } else {
        dispatch({
          type: stockConstants.CREATE_STOCK_ENTRY_FAILURE,
          payload: res?.data?.message || "Failed to create stock entry",
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: stockConstants.CREATE_STOCK_ENTRY_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const setSelectedCategory = (categoryId: string | null) => {
  return {
    type: stockConstants.SET_SELECTED_CATEGORY,
    payload: categoryId,
  };
};

export const getStockHistory = (
  categoryId: string,
  page: number = 1,
  limit: number = 15,
  startDate?: string,
  endDate?: string
) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: stockConstants.GET_STOCK_HISTORY_REQUEST });
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axios.get(`/stock/category/${categoryId}?${params.toString()}`);
      if (res?.data?.success) {
        dispatch({
          type: stockConstants.GET_STOCK_HISTORY_SUCCESS,
          payload: res.data.data,
        });
      } else {
        dispatch({
          type: stockConstants.GET_STOCK_HISTORY_FAILURE,
          payload: res.data?.message || "Failed to fetch stock history",
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: stockConstants.GET_STOCK_HISTORY_FAILURE,
        payload: error.message,
      });
    }
  };
};
