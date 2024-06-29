"use client"
import React from 'react'

import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const AgoraRTCProviders = ({ children }) => {
	const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
	return (
		<AgoraRTCProvider client={client}>
			{children}
		</AgoraRTCProvider>
	)
}

export default AgoraRTCProviders