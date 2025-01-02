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
});

export default store;
