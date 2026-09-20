import { orderConstants } from "@/constants/action.constant";
import type { orderAction, orderState } from "@/constants/types";

const initialState: orderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalOrders: 0,
};

export default (state: orderState = initialState, action: orderAction) => {
  switch (action.type) {
    case orderConstants.FETCH_ORDERS_REQUEST:
    case orderConstants.CREATE_ORDER_REQUEST:
    case orderConstants.FETCH_ORDER_BY_ID_REQUEST:
    case orderConstants.ADD_PAYMENT_REQUEST:
      state = {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case orderConstants.FETCH_ORDERS_SUCCESS:
      state = {
        ...state,
        loading: false,
        orders: action.payload.data,
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.pages,
        totalOrders: action.payload.pagination.total,
        totalGrandTotal: action.payload.totals?.totalGrandTotal || 0,
        totalPaidAmount: action.payload.totals?.totalPaidAmount || 0,
        totalDueAmount: action.payload.totals?.totalDueAmount || 0,
      };
      break;

    case orderConstants.CREATE_ORDER_SUCCESS:
      state = {
        ...state,
        loading: false,
        orders: [action.payload, ...state.orders],
        totalOrders: state.totalOrders + 1,
      };
      break;

    case orderConstants.FETCH_ORDER_BY_ID_SUCCESS:
      state = {
        ...state,
        loading: false,
        selectedOrder: action.payload,
      };
      break;

    case orderConstants.ADD_PAYMENT_SUCCESS:
      state = {
        ...state,
        loading: false,
        selectedOrder: action.payload,
        orders: state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o,
        ),
      };
      break;

    case orderConstants.FETCH_ORDERS_FAILURE:
    case orderConstants.CREATE_ORDER_FAILURE:
    case orderConstants.FETCH_ORDER_BY_ID_FAILURE:
    case orderConstants.ADD_PAYMENT_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;

    default:
      break;
  }
  return state;
};
