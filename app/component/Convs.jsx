import Link from 'next/link'
import React, { useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'

const Convs = ({ d, handleMuting, removingchat, href, handleVisible }) => {
	const [show, setShow] = useState(false)
	return (
		<>
			<div onClick={() => setShow(false)} className={` fixed inset-0 ${show ? "z-40" : "-z-20"}  w-screen h-screen`}></div>
			<div

				className="w-[100%]  gap-2 py-2 px-2 duration-200 hover:bg-slate-100 hover:dark:bg-gray-700 h-[55px]  flex flex-row justify-between items-center "
			>
				<Link onClick={handleVisible} href={href} className=" gap-2 py-2 flex flex-row justify-start items-center ">
					<div>
						<img
							src={d?.pic}
							className="h-[40px] w-[40px] rounded-[17px] ring-1 dark:ring-[#273142] ring-white bg-white dark:bg-bluedark "
						/>
					</div>
					<div>
						<div className="text-[15px] font-semibold">
							{d?.fullname}
						</div>
						{d?.msgs[0]?.typ === "message" && <div className="text-[14px] ">{d?.msgs[0]?.text.length > 30 ? `${d?.msgs[0]?.text.slice(0, 15)}..` : d?.msgs[0]?.text}</div>}
						{d?.msgs[0]?.typ === "image" && <div>Image</div>}
						{d?.msgs[0]?.typ === "video" && <div>Video</div>}
						{d?.msgs[0]?.typ === "doc" && <div>Document</div>}
						{d?.msgs[0]?.typ === "glimpse" && <div>Glimpse</div>}
						{d?.msgs[0]?.typ === "reply" && <div className='text-[14px]'>{d?.msgs[0]?.text.length > 30 ? `${d?.msgs[0]?.text.slice(0, 15)}..` : d?.msgs[0]?.text}</div>}
						{d?.msgs[0]?.typ === "post" && <div>Post</div>}
						{d?.msgs[0]?.typ === "gif" && <div>Gif</div>}
						{d?.msgs[0]?.typ === "product" && <div>Product</div>}
					</div>
				</Link>
				<div className="flex justify-center items-center gap-2">

					{d?.unread != "0" && <div className="w-6 h-6 p-1 text-xs bg-blue-700 text-white flex justify-center items-center rounded-full">{d?.unread}</div>}
					<div className="relative">
						<CiMenuKebab onClick={() => setShow(true)} />

						{show && <div className="absolute top-2 -left-[100px] bg-[#333]  text-white py-3 rounded-xl z-40 w-[100px]">
							<div className="flex flex-col ">
								<div className='hover:bg-[#555]  mb-2 px-3'>{d?.ismuted ? <div onClick={() => handleMuting(d?.convid)}>UnMute</div> : <div onClick={() => handleMuting(d?.convid)}>Mute</div>}</div>
								<div className='hover:bg-[#555]   px-3' onClick={() => removingchat(d?.convid)}>Delete</div>
							</div>
						</div>}
					</div>

				</div>
			</div >

			<div className="w-[99%] border-b-[0.5px] "></div>
		</>
	)
}

export default Convs