import axios from 'axios'
import React, { useEffect } from 'react'
import { API } from '../../Essentials'
import { useSelector } from 'react-redux'
import { setHiddenMsgs } from '../redux/slice/messageSlice'
import PrivateChats from './PrivateChats'


const Hidden = ({ id, convId, dispatch, data, user }) => {
	const hiddenMsgs = useSelector((state) => state.message.hiddenMsg)

	const fetchHiddenMsgs = async () => {
		try {
			const res = await axios.get(`${API}/fetchhiddenconv/${id}/${convId}`)
			console.log(res.data, "response")
			if (res.data.success) {
				dispatch(setHiddenMsgs(res.data.messages))

			}
		} catch (error) {
			console.log(error)
		}
	}

	const loadmore = async () => {
		try {
			const res = await axios.get(`${API}/fetchmorehiddenconv/${id}`, { convId })
			console.log(res.data)
			if (res.data.success) {
				dispatch(setHiddenMsgs([res.data.messages, ...hiddenMsgs]))
			}
		} catch (error) {
			console.log(error)
		}
	}

	console.log(hiddenMsgs)

	useEffect(() => {
		fetchHiddenMsgs()
	}, [])

	return (
		// <InfiniteScroll
		// 	dataLength={hiddenMsgs.length}
		// 	next={loadmore}
		// 	style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
		// 	inverse={true} //
		// 	hasMore={true}
		// 	loader={
		// 		<div className="flex justify-center items-center p-3">
		// 			<div className="animate-spin ">
		// 				<LuLoader2 />
		// 			</div>
		// 		</div>
		// 	}
		// 	scrollableTarget="scrollableDiv"
		// >
		<div>
			{hiddenMsgs.map((d, i) => (
				// <div
				// 	key={i}
				// 	className={`flex  gap-2 my-2 ${data?.id === d?.sender?._id
				// 		? "justify-end "
				// 		: "justify-start "
				// 		}  w-full items-start`}
				// >

				// 	{data?.id !== d?.sender?._id && <div className="flex flex-col items-center justify-center">
				// 		{data?.id !== d?.sender?._id && <div className="h-[40px] w-[40px] overflow-hidden bg-[#fff] rounded-2xl">
				// 			<img src={user?.profilepic} className="w-full h-full" />
				// 		</div>}

				// 		<div className="text-[14px] mt-1">7:07</div>
				// 	</div>}
				// 	<div className="flex items-centers ">

				// 		{d?.typ === "message" && (
				// 			<div
				// 				className={`relative h-auto group flex justify-center items-center mt-6 ${data?.id === d?.sender?._id
				// 					? "bg-[#0075ff] text-white p-2  rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
				// 					: "bg-[#ffffff] p-2 rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
				// 					}`}
				// 			>
				// 				<div className="group-hover:pr-2">{d.text}</div>
				// 				<div onClick={() => setClick(true)} className={` ${data?.id === d?.sender?._id ? "absolute  hidden bg-transparent group-hover:block bg-sky-950 top-3 right-0" : "hidden"}`}>
				// 					<HiOutlineDotsVertical />
				// 				</div>
				// 				{click && <div className={` ${data?.id === d?.sender?._id ? "absolute z-40 bg-black top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto" : "hidden"}`}>
				// 					<div onClick={() => hideChats(d?.mesId)}
				// 						className="text-sm">Hide msg</div>

				// 				</div>}
				// 			</div>
				// 		)}


				// 		{d?.typ == "image" && (
				// 			<div
				// 				className={`${data?.id === d?.sender?._id
				// 					? "bg-[#0075ff] text-white p-2 rounded-l-2xl mt-4 rounded-br-2xl "
				// 					: "bg-[#ffffff] p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
				// 					}`}
				// 			>
				// 				<img
				// 					src={d?.url}
				// 					className="h-[145px] sm:w-[240px] sm:h-[240px] w-[145px] rounded-2xl  bg-yellow-300 "
				// 				/>
				// 			</div>
				// 		)}
				// 		{d?.typ == "video" && (
				// 			<div
				// 				className={`${data?.id === d?.sender?._id
				// 					? " bg-[#0075ff] text-white h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-l-2xl rounded-br-2xl"
				// 					: "bg-[#ffffff] h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-r-2xl rounded-bl-2xl"
				// 					}`}
				// 			>
				// 				{/* <ReactPlayer url={d?.url} controls /> */}

				// 				<MediaPlayer src={d?.url} onQualitiesChange={480}>
				// 					<MediaProvider />
				// 					<DefaultVideoLayout
				// 						thumbnails={d?.url}
				// 						icons={defaultLayoutIcons}
				// 					/>
				// 				</MediaPlayer>

				// 				{/* <video src={d?.url} className="h-[145px] w-[145px] rounded-2xl bg-yellow-300 " controls /> */}
				// 			</div>
				// 		)}
				// 		{d?.typ == "glimpse" && (
				// 			<div className="bg-[#0075ff] text-white p-2 rounded-r-2xl rounded-bl-2xl">
				// 				<video
				// 					src={d?.url}
				// 					className="h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
				// 					controls
				// 				/>
				// 			</div>
				// 		)}
				// 		{d?.typ == "post" && (
				// 			<div
				// 				className={`${data?.id === d?.sender?._id
				// 					? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
				// 					: "bg-[#ffffff] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
				// 					}`}
				// 			>
				// 				<div className="">
				// 					{d?.content.type.startsWith("image") ? (
				// 						<img
				// 							className={`${data?.id === d?.sender?._id
				// 								? "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
				// 								: "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300"
				// 								}`}
				// 							src={d?.url}
				// 							alt=""
				// 						/>
				// 					) : (
				// 						<video
				// 							src={d?.url}
				// 							className={`${data?.id === d?.sender?._id
				// 								? "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
				// 								: "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300"
				// 								}`}
				// 							controls
				// 						/>
				// 					)}
				// 				</div>
				// 				<div className="h-[45px] sm:h-[40px] sm:w-[240px] w-[145px] rounded-2xl ">
				// 					{d?.text}
				// 				</div>
				// 				<div className="text-[14px] sm:w-[240px] flex justify-center items-center w-[145px] h-[40px] bg-[#f7f7f7] rounded-xl">
				// 					Visit
				// 				</div>
				// 			</div>
				// 		)}
				// 		{d?.typ == "product" && (
				// 			<div
				// 				className={`${data?.id === d?.sender?._id
				// 					? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
				// 					: "bg-[#ffffff] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
				// 					}`}
				// 			>
				// 				<div>
				// 					{d?.content.type.startsWith("image") ? (
				// 						<img
				// 							src={d?.url}
				// 							alt=""
				// 							className="h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
				// 						/>
				// 					) : (
				// 						<video
				// 							src={d?.url}
				// 							controls
				// 							className="h-[145px] w-[145px] sm:h-[240px] sm:w-[240px] rounded-2xl bg-yellow-300 "
				// 						/>
				// 					)}
				// 				</div>
				// 				<div className="w-[145px] sm:w-[240px] overflow-hidden text-[14px] h-[80px]">
				// 					{d?.text}
				// 				</div>
				// 				<div className="text-[14px] sm:w-[240px] flex justify-center items-center w-[145px] h-[40px] bg-white rounded-xl">
				// 					View Product
				// 				</div>
				// 			</div>
				// 		)}
				// 		{d?.typ == "gif" && (
				// 			<div>
				// 				<div className="max-h-[145px] max-w-[145px] sm:max-h-[230px] sm:max-w-[230px]">
				// 					<img
				// 						className="h-full w-full object-contain"
				// 						src={d?.url}
				// 						alt="gif"
				// 					/>
				// 				</div>
				// 			</div>
				// 		)}
				// 	</div>
				// 	{data?.id === d?.sender?._id && <div className="flex flex-col items-center justify-center">

				// 		{data?.id === d?.sender?._id && <div className="h-[35px]  relative w-[35px]  overflow-hidden bg-[#fff] rounded-[14px]">
				// 			<div className="absolute top-0 left-0 bg-black/40 w-full h-full"></div>
				// 			<img src={data?.dp} className="w-full h-full" />
				// 		</div>}

				// 		<div className="text-[14px] mt-1">7:07</div>
				// 	</div>}
				// </div>
				<PrivateChats
					d={d}
					data={data}
					i={i}
					showHiddenreply={false}
					user={user}
					dispatch={dispatch}
				/>
			))}
		</div>
		// </InfiniteScroll>

	)
}

export default Hidden