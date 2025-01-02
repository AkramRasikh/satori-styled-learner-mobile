import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import wordReducer from './wordSlice';

const store = configureStore({
  reducer: {
    learningContent: dataReducer,
    words: wordReducer,
  },
});

export default store;
