import {createSlice} from '@reduxjs/toolkit';

const wordSlice = createSlice({
  name: 'words',
  initialState: [],
  reducers: {
    setWordsStateDispatch: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setWordsStateDispatch} = wordSlice.actions;

export default wordSlice.reducer;
