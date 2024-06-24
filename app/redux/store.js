import { configureStore } from "@reduxjs/toolkit";
import messageSlice from "./slice/messageSlice";
import comChatSlice from "./slice/comChatSlice";
import anotherSlice from "./slice/anotherSlice";
import rememberSlice from "./slice/remember";

export const store = configureStore({
  reducer: {
    message: messageSlice,
    comChat: comChatSlice,
    another: anotherSlice,
    remember: rememberSlice
  },
  // middleware: (getDefaultMiddleware) =>
  // 	getDefaultMiddleware({
  // 		serializableCheck: false
  // 	}).concat(api.middleware),
});
