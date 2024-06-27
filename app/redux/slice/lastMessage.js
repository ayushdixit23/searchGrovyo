import { createSlice } from "@reduxjs/toolkit";

export const lastMessage = createSlice({
	name: "lastmessage",
	initialState: {
		data: []
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload
		},
		setLastmsgs: (state, action) => {
			const old = state.data;
			return {
				...state,
				data: [...old, action.payload],
			};
		},
	},
});

export const {
	setLastmsgs,
	setData
} = lastMessage.actions;
export default lastMessage.reducer;
