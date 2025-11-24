import {configureStore} from '@reduxjs/toolkit';
import contentReducer from './contentSlice';
import wordReducer from './wordSlice';
import sentencesReducer from './sentencesSlice';

const store = configureStore({
  reducer: {
    learningContent: contentReducer,
    words: wordReducer,
    sentences: sentencesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 disables the warning
    }),
});

export default store;
