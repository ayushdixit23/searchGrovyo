import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: "",
    messages: [],
    type: "",
    content: "",
    name: "",
    size: "",
    hiddenMsg: [],
    replyId: "",
    reply: "",
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setContent: (state, action) => {
      const { content, name, size } = action.payload;
      state.content = content;
      state.name = name;
      state.size = size;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setincommsgs: (state, action) => {
      const old = state.messages;
      return {
        ...state,
        messages: [...old, action.payload],
      };
    },
    setHiddenMsgs: (state, action) => {
      state.hiddenMsg = action.payload;
    },
    setReplyFunction: (state, action) => {
      const { reply, replyId } = action.payload;
      state.reply = reply;
      state.replyId = replyId;
    },
    removechatmsg: (state, action) => {
      if (state.messages?.length > 0) {
        const index = state.messages?.findIndex((chat) => {
          return action.payload === chat?.mesId;
        });
        console.log(index, state.messages);
        if (index !== -1) {
          state.messages[index].status = "deleted";
        }
      }
    },
  },
});

export const {
  setMessage,
  setType,
  setContent,
  setMessages,
  setincommsgs,
  setReplyFunction,
  setHiddenMsgs,
  removechatmsg,
} = messageSlice.actions;
export default messageSlice.reducer;
