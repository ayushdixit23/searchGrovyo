import { createSlice } from "@reduxjs/toolkit";

export const comChatSlice = createSlice({
	name: "comChat",
	initialState: {
		message: "",
		type: "",
		content: "",
		name: "",
		size: "",
		messages: [],
		replyId: "",
		reply: ""
	},
	reducers: {
		setMessage: (state, action) => {
			state.message = action.payload
		},
		setType: (state, action) => {
			state.type = action.payload
		},
		setContent: (state, action) => {
			const { content, name, size } = action.payload
			state.content = content
			state.name = name
			state.size = size
		},
		setMessages: (state, action) => {
			state.messages = action.payload
		},
		setincommsgs: (state, action) => {
			const old = state.messages
			return {
				...state,
				messages: [...old, action.payload]
			}
		},
		setReplyFunction: (state, action) => {
			const { reply, replyId } = action.payload
			state.reply = reply
			state.replyId = replyId
		}
	}
})

export const { setMessage, setType, setContent, setMessages, setReplyFunction, setincommsgs } = comChatSlice.actions
export default comChatSlice.reducer
