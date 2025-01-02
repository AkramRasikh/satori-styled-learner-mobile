import {createSlice} from '@reduxjs/toolkit';

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState: [],
  reducers: {
    setSnippetsStateDispatch: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setSnippetsStateDispatch} = snippetsSlice.actions;

export default snippetsSlice.reducer;
