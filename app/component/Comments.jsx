import { API } from '@/Essentials'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Comments = ({ id, postId, dp, fullname }) => {
	const [comments, setComments] = useState([])
	const [comment, setComment] = useState("")

	useEffect(() => {
		if (id && postId) {
			axios.get(`${API}/fetchallcomments/${id}/${postId}`).then((res) => {
				console.log(res.data.merged)
				setComments(res.data.merged)
			})
		}
	}, [id, postId])

	const handleCreateComments = async () => {
		try {
			const res = await axios.post(`${API}/createcomment/${id}/${postId}`, {
				text: comment
			})

			const obj = {
				dp,
				comments: {
					senderId: {
						fullname
					},
					text: comment
				}
			}
			if (res.data.success) {
				setComments([obj, ...comments])
				setComment("")
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<div>
				{
					comments?.map((d, i) => (
						<div key={i}>
							<div className='flex items-center gap-2'>
								<div className='w-[50px] h-[50px]'>
									<img src={d?.dp} />
								</div>
								<div className='flex flex-col gap-1'>
									<div>{d?.comments?.senderId?.fullname}</div>
									<div>{d?.comments?.text}</div>
								</div>
							</div>

						</div>
					))
				}
			</div>
			<div>
				<input value={comment} onChange={(e) => setComment(e.target.value)} className='p-3 outline-none border-2 rounded-xl border-[#f1f1f1]' />
			</div>
			<div>
				<button onClick={handleCreateComments}>send</button>
			</div>
		</>
	)
}

export default Comments