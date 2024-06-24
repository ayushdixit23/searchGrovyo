import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://work.grovyo.xyz/api"
		// baseUrl: "http://192.168.29.225:7190/api"
		// baseUrl: "http://192.168.29.230:7190/api"
		// baseUrl: "http://192.168.1.11:7190/api"
	}),
	endpoints: (builder) => ({

	})
})

export const {

} = api