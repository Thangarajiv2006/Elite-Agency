import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import {
  CategoryDetails,
  ForgotPassword,
  Home,
  Login,
  Settings,
  Shop,
  SignUp,
  WorkerDetails,
  Workers,
  CreateOrder,
  OrdersList,
  OrderDetails,
} from "./app/pages/";
import AuthRoute from "./app/Private/AuthRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { aldreadyLogin } from "./actions/auth.action";
import ShopDetails from "./app/pages/ShopDetails";
import CategoryStockEntry from "./app/pages/CategoryStockEntry";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = window.localStorage.getItem("user");
    if (token && user) {
      dispatch(aldreadyLogin());
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<AuthRoute />}>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="category/:id" element={<CategoryDetails />} />
            <Route path="shops">
              <Route index element={<Shop />} />
              <Route path=":id" element={<ShopDetails />} />
            </Route>
            <Route path="workers">
              <Route index element={<Workers />} />
              <Route path=":id" element={<WorkerDetails />} />
            </Route>
            <Route path="update-stocks" element={<CategoryStockEntry />} />
            <Route path="orders">
              <Route index element={<OrdersList />} />
              <Route path="create" element={<CreateOrder />} />
              <Route path=":id" element={<OrderDetails />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
