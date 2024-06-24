import { createSlice } from "@reduxjs/toolkit";

export const anotherSlice = createSlice({
  name: "another",
  initialState: {
    loading: false,
    visible: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setVisible: (state, action) => {
      state.visible = action.payload;
    },
  },
});

export const { setLoading, setVisible } = anotherSlice.actions;
export default anotherSlice.reducer;
