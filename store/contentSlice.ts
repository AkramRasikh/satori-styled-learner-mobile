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
    updateSentenceRemoveReviewStateDispatch: (state, action) => {
      const {sentenceId, contentIndex} = action.payload;
      const thisTopicData = state[contentIndex];
      const sentenceIndex = thisTopicData.content.findIndex(
        s => s.id === sentenceId,
      );

      if (sentenceIndex !== -1) {
        const {reviewData, ...updatedSentence} =
          thisTopicData.content[sentenceIndex]; // Remove `reviewData`
        thisTopicData.content[sentenceIndex] = updatedSentence; // Replace with updated object
      }
    },
  },
});

export const updateSentenceRemoveReviewAndReturnState =
  payload => (dispatch, getState) => {
    dispatch(updateSentenceRemoveReviewStateDispatch(payload)); // Dispatch the existing reducer action
    return getState();
  };
export const updateSentenceAndReturnState = payload => (dispatch, getState) => {
  dispatch(updateSentenceStateDispatch(payload)); // Dispatch the existing reducer action
  return getState();
};

export const {
  setLearningContentStateDispatch,
  updateSentenceRemoveReviewStateDispatch,
  updateSentenceStateDispatch,
} = contentSlice.actions;

export default contentSlice.reducer;
