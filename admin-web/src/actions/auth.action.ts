import { authConstants } from "@/constants/action.constant";
import type { AuthForm, AuthState } from "@/constants/types";
import axios from "@/helpers/axios";
import type { Dispatch } from "redux";

export const verifyOTP = (data: AuthForm) => {
  return async () => {
    try {
      const res = await axios.post("/auth/verify-otp-sign-up", data);
      return res;
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };
};

export const login = (data: Pick<AuthForm, "email" | "password">) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post("/auth/login", data);

      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            user: res.data.user,
            token: res.data.token,
          },
        });
      }
      return res;
    } catch (err) {
      console.error("Login failed", err);
    }
  };
};

export const aldreadyLogin = () => {
  return (dispatch: Dispatch) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")!;
    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: {
        token: token,
        user: JSON.parse(user),
      },
    });
  };
};

export const logout = () => {
  return (dispatch: Dispatch) => {
    localStorage.clear();
    dispatch({
      type: authConstants.LOGOUT_SUCCESS,
    });
  };
};

export const updateProfile = (data: AuthState["user"]) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.put("/auth/update-profile", data);
      if (res.data.status === "success") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        dispatch({
          type: authConstants.LOGIN_SUCCESS,
          payload: {
            user: res.data.user,
            token: localStorage.getItem("token"),
          },
        });
      }
      return res;
    } catch (e) {
      console.log("Update profile failed", e);
    }
  };
};
