import { productConstants } from "@/constants/action.constant";
import type { productState } from "@/constants/types";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const createProduct = (product: Partial<productState["products"][0]>) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post("/product", product);
      if (res?.data.status === "success") {
        dispatch({
          type: productConstants.CREATE_PRODUCT_SUCCESS,
          payload: res.data.product,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const getProducts = (
  categoryId: string,
  page: number,
  limit: number = productConstants.QUERY_PER_PAGE,
  search: string = "",
  stockBelow?: number,
) => {
  return async (dispatch: Dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("categoryId", categoryId);
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (search) params.append("search", search);
      if (stockBelow !== undefined) params.append("stockBelow", String(stockBelow));
      const res = await axios.get(`/product?${params.toString()}`);
      if (res?.data.status === "success") {
        dispatch({
          type: productConstants.GET_PRODUCTS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const updateProduct = (data: Partial<productState["products"][0]>) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.put(`/product`, data);
      if (res.data.status === "success") {
        dispatch({
          type: productConstants.PRODUCT_UPDATED_SUCCESS,
          payload: data,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const deleteProduct = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.delete(`/product/${id}`);
      if (res.data.status === "success") {
        dispatch({
          type: productConstants.PRODUCT_DELETED_SUCCESS,
          payload: id,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};
