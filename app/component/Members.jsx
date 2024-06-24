import { API } from '@/Essentials'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Members = ({ id, comId }) => {
	const [members, setMembers] = useState([])

	useEffect(() => {
		if (id && comId)
			axios.get(`${API}/web/getallmembers/${id}/${comId}`).then((res) => {
				console.log(res.data)
				setMembers(res.data.members)
			})
	}, [id, comId])

	return (
		<>
			<div className='flex flex-col w-full justify-normal gap-2'>
				{
					members.map((d, i) => (
						<div key={i}>
							<div className='flex justify-center items-center gap-2'>
								<div className='w-[60px] h-[60px]'>
									<img src={d?.dp} />
								</div>
								<div className='flex text-white flex-col gap-1'>
									<div>{d?.c?.fullname}</div>
									<div>{d?.c?.username}</div>
								</div>
							</div>
						</div>
					))
				}
			</div>
		</>
	)
}

export default Members