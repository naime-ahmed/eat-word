import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  popupZIndex: 2147483000, // Base z-index value
};

const popupZIndexSlice = createSlice({
  name: "popupZIndex",
  initialState,
  reducers: {
    incrementPopupZIndex: (state) => {
      state.popupZIndex += 1;
    },
  },
});

export const { incrementPopupZIndex } = popupZIndexSlice.actions;
export default popupZIndexSlice.reducer;