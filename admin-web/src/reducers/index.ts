import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import workerReducer from "./worker.reducer";
import categoryReducer from "./category.reducer";
import shopReducer from "./shop.reducer";
import productReducer from "./product.reducer";
import stockReducer from "./stock.reducer";
import orderReducer from "./order.reducer";
import analyticsReducer from "./analytics.reducer";
import attendanceReducer from "./attendance.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  worker: workerReducer,
  category: categoryReducer,
  shop: shopReducer,
  product: productReducer,
  stock: stockReducer,
  order: orderReducer,
  analytics: analyticsReducer,
  attendance: attendanceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
