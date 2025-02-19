import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LoginedRoute = () => {
  const agencyData = useSelector((state) => state.auth);
  return agencyData.token && agencyData.isLogined ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default LoginedRoute;
