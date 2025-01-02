import {configureStore} from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import wordReducer from './wordSlice';
import sentencesReducer from './sentencesSlice';

const store = configureStore({
  reducer: {
    learningContent: dataReducer,
    words: wordReducer,
    sentences: sentencesReducer,
  },
});

export default store;
