import type { RootState } from "@/reducers";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AuthRoute = () => {
  const userData = useSelector((state: RootState) => state.auth);
  return userData.token ? <Outlet /> : <Navigate to={"/login"} />;
};

export default AuthRoute;
