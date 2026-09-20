import { analyticsConstants } from "@/constants/action.constant";

export interface AnalyticsState {
  revenue: any;
  products: any[];
  customers: any;
  payments: any;
  status: any;
  salesTime: any[];
  recentInvoices: any[];
  loading: boolean;
  error: string | null;
}

const initState: AnalyticsState = {
  revenue: null,
  products: [],
  customers: {},
  payments: null,
  status: null,
  salesTime: [],
  recentInvoices: [],
  loading: false,
  error: null,
};

const analyticsReducer = (state = initState, action: any): AnalyticsState => {
  switch (action.type) {
    // --- REQUESTS ---
    case analyticsConstants.FETCH_REVENUE_REQUEST:
    case analyticsConstants.FETCH_TOP_PRODUCTS_REQUEST:
    case analyticsConstants.FETCH_CUSTOMERS_REQUEST:
    case analyticsConstants.FETCH_PAYMENTS_REQUEST:
    case analyticsConstants.FETCH_STATUS_REQUEST:
    case analyticsConstants.FETCH_SALES_TIME_REQUEST:
    case analyticsConstants.FETCH_RECENT_INVOICES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    // --- SUCCESSES ---
    case analyticsConstants.FETCH_REVENUE_SUCCESS:
      return {
        ...state,
        loading: false,
        revenue: action.payload,
      };
    case analyticsConstants.FETCH_TOP_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
      };
    case analyticsConstants.FETCH_CUSTOMERS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: action.payload,
      };
    case analyticsConstants.FETCH_PAYMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payments: action.payload,
      };
    case analyticsConstants.FETCH_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        status: action.payload,
      };
    case analyticsConstants.FETCH_SALES_TIME_SUCCESS:
      return {
        ...state,
        loading: false,
        salesTime: action.payload,
      };
    case analyticsConstants.FETCH_RECENT_INVOICES_SUCCESS:
      return {
        ...state,
        loading: false,
        recentInvoices: action.payload,
      };

    // --- FAILURES ---
    case analyticsConstants.FETCH_REVENUE_FAILURE:
    case analyticsConstants.FETCH_TOP_PRODUCTS_FAILURE:
    case analyticsConstants.FETCH_CUSTOMERS_FAILURE:
    case analyticsConstants.FETCH_PAYMENTS_FAILURE:
    case analyticsConstants.FETCH_STATUS_FAILURE:
    case analyticsConstants.FETCH_SALES_TIME_FAILURE:
    case analyticsConstants.FETCH_RECENT_INVOICES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default analyticsReducer;
