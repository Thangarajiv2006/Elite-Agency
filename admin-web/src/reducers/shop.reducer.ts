import { shopConstants } from "@/constants/action.constant";
import type { shopAction, shopState } from "@/constants/types";

const initialState: shopState = {
  shops: [],
  village: new Set<string>(),
  district: new Set<string>(),
  totalShops: 0,
  currentPage: 1,
  totalPages: 0,
  quriedShops: 0,
};

export default (state: shopState = initialState, action: shopAction) => {
  switch (action.type) {
    case shopConstants.CREATE_SHOP_SUCCESS:
      state = {
        ...state,
        shops: [action.payload, ...state.shops],
        totalShops: state.totalShops + 1,
        currentPage: state.currentPage,
        totalPages: Math.ceil(
          (state.totalShops + 1) / shopConstants.QUERY_PER_PAGE,
        ),
        village: new Set([action.payload.address.village, ...state.village]),
        district: new Set([action.payload.address.district, ...state.district]),
        quriedShops: state.quriedShops + 1,
      };
      break;
    case shopConstants.GET_SHOPS_SUCCESS:
      state = {
        ...state,
        shops: action.payload.shops,
        village: new Set(action.payload.villages),
        district: new Set(action.payload.districts),
        totalShops: action.payload.total,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        quriedShops: action.payload.quriedShops,
      };
      break;
    case shopConstants.SHOP_UPDATED_SUCCESS:
      state = {
        ...state,
        shops: state.shops.map((s) =>
          s._id === action.payload._id ? action.payload : s,
        ),
      };
      break;
    case shopConstants.SHOP_DELETED_SUCCESS:
      state = {
        ...state,
        shops: state.shops.filter((s) => s._id !== action.payload),
        totalShops: state.totalShops - 1,
      };
      break;
    default:
      break;
  }
  return state;
};
