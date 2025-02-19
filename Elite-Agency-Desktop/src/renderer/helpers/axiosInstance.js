import axios from 'axios';
import { API } from '../urlConfig';
import { authConstant } from '../actions/constants';

const getToken = () => window.localStorage.getItem('token') || null;

const axiosInstance = axios.create({
  baseURL: API.base,
  headers: {
    Authorization: `bearer ${getToken()}`,
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (getToken()) {
    req.headers.Authorization = `bearer ${getToken()}`;
  }
  return req;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const { status } = error.response;

    if (status === 500) {
      window.localStorage.clear();
      window.store.dispatch({
        type: authConstant.LOGOUT_SUCCESS,
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
