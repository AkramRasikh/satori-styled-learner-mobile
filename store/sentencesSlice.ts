import {createSlice} from '@reduxjs/toolkit';

const sentencesSlice = createSlice({
  name: 'sentences',
  initialState: [],
  reducers: {
    setSentencesStateDispatch: (state, action) => {
      return (state = action.payload);
    },
    updateAdhocSentenceStateDispatch: (state, action) => {
      const {sentenceId, fieldToUpdate} = action.payload;
      const sentence = state.find(item => item.id === sentenceId);
      if (sentence) {
        Object.assign(sentence, fieldToUpdate); // Mutates safely via Immer
      }
    },
    updateAdhocSentenceRemoveReviewStateDispatch: (state, action) => {
      const {sentenceId} = action.payload;
      const item = state.find(item => item.id === sentenceId);
      if (item) {
        delete item?.reviewData;
      }
    },
  },
});
export const updateAdhocSentenceRemoveReviewAndReturnState =
  payload => (dispatch, getState) => {
    dispatch(updateAdhocSentenceRemoveReviewStateDispatch(payload));
    return getState();
  };

export const updateAdhocSentenceAndReturnState =
  payload => (dispatch, getState) => {
    dispatch(updateAdhocSentenceStateDispatch(payload)); // Dispatch the existing reducer action
    return getState();
  };

export const {
  setSentencesStateDispatch,
  updateAdhocSentenceRemoveReviewStateDispatch,
  updateAdhocSentenceStateDispatch,
} = sentencesSlice.actions;

export default sentencesSlice.reducer;
