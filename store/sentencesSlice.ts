import {createSlice} from '@reduxjs/toolkit';

const sentencesSlice = createSlice({
  name: 'sentences',
  initialState: [],
  reducers: {
    setSentencesStateDispatch: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setSentencesStateDispatch} = sentencesSlice.actions;

export default sentencesSlice.reducer;
