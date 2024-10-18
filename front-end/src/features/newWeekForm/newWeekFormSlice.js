import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  numberOfWords: 35,
  learnSynonyms: false,
  includeDefinition: false,
};

const newWeekFormSlice = createSlice({
  name: 'newWeekForm',
  initialState,
  reducers: {
    updateNewWeekForm: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetNewWeekForm: (state) => {
        state.numberOfWords = 35;
        state.learnSynonyms = false;
        state.includeDefinition = false;
    }
  },
});

export const { updateNewWeekForm, resetNewWeekForm } = newWeekFormSlice.actions;

export default newWeekFormSlice.reducer;