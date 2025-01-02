import {createSlice} from '@reduxjs/toolkit';

// content
// words
// snippets
// sentences

const dataSlice = createSlice({
  name: 'content',
  initialState: {value: 0},
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const {increment, decrement, incrementByAmount} = dataSlice.actions;

export default dataSlice.reducer;
