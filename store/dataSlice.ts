import {createSlice} from '@reduxjs/toolkit';

// content
// words
// snippets
// sentences

const dataSlice = createSlice({
  name: 'content',
  initialState: [],
  reducers: {
    setLearningContentStateDispatch: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setLearningContentStateDispatch} = dataSlice.actions;

export default dataSlice.reducer;
