import {createSlice} from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: [],
  reducers: {
    setLearningContentStateDispatch: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setLearningContentStateDispatch} = contentSlice.actions;

export default contentSlice.reducer;
