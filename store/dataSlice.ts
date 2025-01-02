import {createSlice} from '@reduxjs/toolkit';

// content
// words
// snippets
// sentences

const dataSlice = createSlice({
  name: 'content',
  initialState: [],
  reducers: {
    setLearningContentState: (state, action) => {
      state = action.payload;
    },
  },
});

export const {setLearningContentState} = dataSlice.actions;

export default dataSlice.reducer;
