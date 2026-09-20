import { authConstants } from "@/constants/action.constant";
import type { AuthState, LoginAction } from "@/constants/types";

const initialState: AuthState = {
  user: null,
  token: null,
};

export default (state = initialState, action: LoginAction) => {
  switch (action.type) {
    case authConstants.LOGIN_SUCCESS:
      state = {
        user: action.payload.user,
        token: action.payload.token,
      };
      break;
    case authConstants.LOGOUT_SUCCESS:
      state = initialState;
      break;
    default:
      break;
  }
  return state;
};
