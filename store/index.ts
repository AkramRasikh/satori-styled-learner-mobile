import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './dataSlice';

const store = configureStore({
  reducer: {
    counter: dataReducer,
  },
});

export default store;
