import {createSlice} from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: [],
  reducers: {
    setLearningContentStateDispatch: (state, action) => {
      return (state = action.payload);
    },
    updateSentenceStateDispatch: (state, action) => {
      const {sentenceId, fieldToUpdate, contentIndex} = action.payload;
      const thisTopicData = state[contentIndex];
      const sentence = thisTopicData.content.find(s => s.id === sentenceId);
      if (sentence) {
        Object.assign(sentence, fieldToUpdate); // Mutates safely via Immer
      }
    },
  },
});

export const updateSentenceAndReturnState = payload => (dispatch, getState) => {
  dispatch(updateSentenceStateDispatch(payload)); // Dispatch the existing reducer action
  return getState();
};

export const {setLearningContentStateDispatch, updateSentenceStateDispatch} =
  contentSlice.actions;

export default contentSlice.reducer;
