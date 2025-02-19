import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import workerReducer from './worker.reducer';
import categoryReducer from './category.reducer';
import shopsReducer from './shops.reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  worker: workerReducer,
  category: categoryReducer,
  shops: shopsReducer,
});

export default rootReducer;
