import axios from '../helpers/axiosInstance';
import { workerConstant } from './constants';

export const addWorker = (data) => {
  return async (dispatch) => {
    dispatch({
      type: workerConstant.CREATE_WORKER_REQUEST,
    });
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('email', data.email.trim());
      formData.append('mobile', data.mobile.trim());
      formData.append('password', data.password.trim());
      formData.append('photo', data.photo[0]);
      const res = await axios.post('/worker/create', formData);
      if (res.data.errorCode) {
        dispatch({
          type: workerConstant.CREATE_WORKER_FAILURE,
          payload: res.data,
        });
      } else if (res.status === 201) {
        dispatch({
          type: workerConstant.CREATE_WORKER_SUCCESS,
          payload: res.data,
        });
      }
    } catch (e) {
      dispatch({
        type: workerConstant.CREATE_WORKER_AXIOS_ERROR,
      });
    }
  };
};

export const getWorker = (data) => {
  return async (dispatch) => {
    dispatch({
      type: workerConstant.GET_WORKER_REQUEST,
    });
    try {
      const res = await axios.post('/worker/get', data);
      console.log(res.data);
      if (res.data.errorCode) {
        dispatch({
          type: workerConstant.CREATE_WORKER_FAILURE,
          payload: res.data,
        });
      } else if (res.status === 200) {
        dispatch({
          type: workerConstant.GET_WORKER_SUCCESS,
          payload: res.data,
        });
      }
    } catch (e) {
      dispatch({
        type: workerConstant.GET_WORKER_AXIOS_ERROR,
      });
    }
  };
};

export const deactiveWorker = (formData) => {
  return async (dispatch) => {
    try {
      const res = await axios.put('/worker/deactive', formData);
      if (res.data.errorCode && res.data.errorMessage) {
        dispatch({
          type: workerConstant.DEACTIVE_WORKER_FAILURE,
          payload: {
            errorCode: res.data.errorCode,
            errorMessage: res.data.errorMessage,
          },
        });
      } else if (res.status === 201) {
        dispatch({
          type: workerConstant.DEACTIVE_WORKER_SUCCESS,
          payload: {
            workerId: formData.workerId,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
