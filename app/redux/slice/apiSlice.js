import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react"

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://work.grovyo.xyz/api"
	}),
	endpoints: (builder) => ({

	})
})

export const {

} = api