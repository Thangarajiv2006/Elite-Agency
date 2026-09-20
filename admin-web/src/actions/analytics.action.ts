import { analyticsConstants } from "@/constants/action.constant";
import type { Dispatch } from "redux";
import * as analyticsService from "@/services/analytics.service";

export const fetchRevenue = (range?: string, startDate?: string, endDate?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_REVENUE_REQUEST });
    try {
      const res = await analyticsService.getRevenue(range, startDate, endDate);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_REVENUE_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_REVENUE_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching revenue",
      });
    }
  };
};

export const fetchTopProducts = (startDate?: string, endDate?: string, limit?: number) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_TOP_PRODUCTS_REQUEST });
    try {
      const res = await analyticsService.getTopProducts(startDate, endDate, limit);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_TOP_PRODUCTS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_TOP_PRODUCTS_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching top products",
      });
    }
  };
};

export const fetchCustomers = (startDate?: string, endDate?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_CUSTOMERS_REQUEST });
    try {
      const res = await analyticsService.getCustomers(startDate, endDate);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_CUSTOMERS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_CUSTOMERS_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching customers",
      });
    }
  };
};

export const fetchPayments = (startDate?: string, endDate?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_PAYMENTS_REQUEST });
    try {
      const res = await analyticsService.getPayments(startDate, endDate);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_PAYMENTS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_PAYMENTS_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching payments",
      });
    }
  };
};

export const fetchStatus = (startDate?: string, endDate?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_STATUS_REQUEST });
    try {
      const res = await analyticsService.getStatus(startDate, endDate);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_STATUS_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_STATUS_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching status",
      });
    }
  };
};

export const fetchSalesTime = (startDate?: string, endDate?: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_SALES_TIME_REQUEST });
    try {
      const res = await analyticsService.getSalesTime(startDate, endDate);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_SALES_TIME_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_SALES_TIME_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching sales time",
      });
    }
  };
};

export const fetchRecentInvoices = (limit: number = 10) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: analyticsConstants.FETCH_RECENT_INVOICES_REQUEST });
    try {
      const res = await analyticsService.getRecentInvoices(limit);
      if (res?.success) {
        dispatch({
          type: analyticsConstants.FETCH_RECENT_INVOICES_SUCCESS,
          payload: res.data,
        });
      }
      return res;
    } catch (error: any) {
      dispatch({
        type: analyticsConstants.FETCH_RECENT_INVOICES_FAILURE,
        payload: error.response?.data?.message || "Something went wrong fetching recent invoices",
      });
    }
  };
};
