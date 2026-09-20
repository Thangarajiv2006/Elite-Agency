import { shopConstants } from "@/constants/action.constant";
import type { shopState } from "@/constants/types";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const createShop = (shop: shopState["shops"][0]) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post("/shop", shop);
      if (res?.data.status === "success") {
        dispatch({
          type: shopConstants.CREATE_SHOP_SUCCESS,
          payload: res.data.shop,
        });
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };
};

export const getShops = (
  page: number,
  limit: number = shopConstants.QUERY_PER_PAGE,
  village: string = "",
  district: string = "",
  search: string = "",
) => {
  return async (dispatch: Dispatch) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (village) params.append("village", village);
      if (district) params.append("district", district);
      if (search) params.append("search", search);
      const res = await axios.get(`/shop?${params.toString()}`);
      console.log(res.data);
      if (res?.data.status === "success") {
        dispatch({
          type: shopConstants.GET_SHOPS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateShop = (data: Partial<shopState["shops"][0]>) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.put(`/shop`, data);
      if (res.data.status === "success") {
        dispatch({
          type: shopConstants.SHOP_UPDATED_SUCCESS,
          payload: data,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};

export const deleteShop = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.delete(`/shop/${id}`);
      if (res.data.status === "success") {
        dispatch({
          type: shopConstants.SHOP_DELETED_SUCCESS,
          payload: id,
        });
      }
      return res;
    } catch (error: any) {
      console.log(error.message);
    }
  };
};
