import { createSlice } from "@reduxjs/toolkit";

export const remberSlice = createSlice({
  name: "remember",
  initialState: {
    convId: "",
    preview: false,
    hide: false,
  },
  reducers: {
    setConvId: (state, action) => {
      state.convId = action.payload;
    },
    setPreview: (state, action) => {
      state.preview = action.payload;
    },
    setHide: (state, action) => {
      state.hide = action.payload;
    },
  },
});

export const { setConvId, setPreview, setHide } = remberSlice.actions;
export default remberSlice.reducer;
