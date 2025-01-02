import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './dataSlice';

const store = configureStore({
  reducer: {
    learningContent: dataReducer,
  },
});

export default store;
