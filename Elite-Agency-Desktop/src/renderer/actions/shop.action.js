import axios from '../helpers/axiosInstance';
import { shopConstant } from './constants';

export const createShops = (formData) => {
  return async (dispatch) => {
    dispatch({ type: shopConstant.CREATE_SHOP_REQUEST });
    try {
      const res = await axios.post('/shops/create', formData);
      console.log(res.data);
      if (res.data.errorCode || res.data.errorMessage) {
        dispatch({ type: shopConstant.CREATE_SHOP_FAILURE, payload: res.data });
      } else {
        dispatch({
          type: shopConstant.CREATE_SHOP_SUCCESS,
          payload: res.data,
        });
      }
    } catch (e) {
      console.log(e);
      dispatch({ type: shopConstant.CREATE_SHOP_AXIOS_ERROR });
    }
  };
};
