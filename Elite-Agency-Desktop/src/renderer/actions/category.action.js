import axios from '../helpers/axiosInstance';
import { categoryConstants } from './constants';

export const createCategory = (data) => {
  return async (dispatch) => {
    dispatch({
      type: categoryConstants.CREATE_CATEGORY_REQUEST,
    });
    try {
      const formData = new FormData();
      formData.append('name', data.name.trim());
      formData.append('photo', data.photo[0]);
      console.log(data.photo[0]);
      console.log(formData);
      const res = await axios.post('/category/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.status === 201) {
        dispatch({
          type: categoryConstants.CREATE_CATEGORY_SUCCESS,
          payload: res.data,
        });
      } else if (res.data.errorCode || res.data.errorMessage) {
        dispatch({
          type: categoryConstants.CREATE_CATEGORY_FAILURE,
          payload: res.data,
        });
      }
    } catch (e) {
      console.log('error: ' + e);
    }
  };
};

export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_ALL_WORKER_REQUEST });
    try {
      const res = await axios.get('/category/get');
      if (res.status === 201) {
        dispatch({
          type: categoryConstants.GET_ALL_WORKER_SUCCESS,
          payload: res.data,
        });
      } else if (res.data.errorCode && res.data.errorMessage) {
        dispatch({
          type: categoryConstants.GET_ALL_WORKER_FAILURE,
          payload: res.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};
