import { orderConstants } from "@/constants/action.constant";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const createOrder = (orderData: any) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: orderConstants.CREATE_ORDER_REQUEST });
    try {
      const res = await axios.post("/orders", orderData);
      if (res?.data.success) {
        dispatch({
          type: orderConstants.CREATE_ORDER_SUCCESS,
          payload: res.data.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: orderConstants.CREATE_ORDER_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    }
  };
};

export const fetchOrders = (
  page: number = 1,
  limit: number = orderConstants.QUERY_PER_PAGE,
  paymentStatus?: string,
  startDate?: string,
  endDate?: string,
  search?: string,
  workerId?: string,
  shopId?: string,
) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: orderConstants.FETCH_ORDERS_REQUEST });
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (paymentStatus && paymentStatus !== "ALL")
        params.append("paymentStatus", paymentStatus);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (search) params.append("search", search);
      if (workerId) params.append("workerId", workerId);
      if (shopId) params.append("shopId", shopId);

      const res = await axios.get(`/orders?${params.toString()}`);
      if (res?.data.success) {
        dispatch({
          type: orderConstants.FETCH_ORDERS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: orderConstants.FETCH_ORDERS_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };
};

export const fetchOrderById = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: orderConstants.FETCH_ORDER_BY_ID_REQUEST });
    try {
      const res = await axios.get(`/orders/${id}`);
      if (res?.data.success) {
        dispatch({
          type: orderConstants.FETCH_ORDER_BY_ID_SUCCESS,
          payload: res.data.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: orderConstants.FETCH_ORDER_BY_ID_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
    }
  };
};

export const addPayment = (
  orderId: string,
  paymentData: {
    amount: number;
    method: string;
    reference?: string;
    note?: string;
  },
) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: orderConstants.ADD_PAYMENT_REQUEST });
    try {
      const res = await axios.patch(`/orders/${orderId}/payment`, paymentData);
      if (res?.data.success) {
        dispatch({
          type: orderConstants.ADD_PAYMENT_SUCCESS,
          payload: res.data.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: orderConstants.ADD_PAYMENT_FAILURE,
        payload: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    }
  };
};
