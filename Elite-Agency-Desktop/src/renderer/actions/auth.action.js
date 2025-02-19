import { authConstant } from './constants';
import axios from '../helpers/axiosInstance';

export const login = (formData) => {
  return async (dispatch) => {
    dispatch({ type: authConstant.LOGIN_REQUEST });
    try {
      const res = await axios.post('/agency/auth/login', formData);
      if (res.data.errorCode) {
        dispatch({
          type: authConstant.LOGIN_FAILURE,
          payload: res.data,
        });
      } else if (res.status === 201) {
        dispatch({
          type: authConstant.LOGIN_SUCCESS,
          payload: res.data,
        });
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem(
          'agencyData',
          JSON.stringify(res.data.agencyDetails),
        );
      }
    } catch (error) {
      dispatch({
        type: authConstant.AUTH_AXIOS_ERROR,
      });
    }
  };
};

export const isAldreadyLogin = () => {
  return async (dispatch) => {
    const agencyData = window.localStorage.getItem('agencyData');
    const token = window.localStorage.getItem('token');
    if (agencyData && token) {
      dispatch({
        type: authConstant.IS_ALDREADY_LOGIN_SUCCESS,
        payload: {
          agencyDetails: JSON.parse(agencyData),
          token,
        },
      });
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.clear();
    dispatch({
      type: authConstant.LOGOUT_SUCCESS,
    });
  };
};
