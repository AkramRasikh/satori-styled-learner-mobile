import {configureStore} from '@reduxjs/toolkit';
import contentReducer from './contentSlice';
import wordReducer from './wordSlice';
import sentencesReducer from './sentencesSlice';
import snippetsReducer from './snippetsSlice';

const store = configureStore({
  reducer: {
    learningContent: contentReducer,
    words: wordReducer,
    sentences: sentencesReducer,
    snippets: snippetsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 disables the warning
    }),
});

export default store;
