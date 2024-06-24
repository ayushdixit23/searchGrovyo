import Image from 'next/image'
import React from 'react'
import earn1 from "../../assets/earn1.png";
import earn2 from "../../assets/earn2.png";
import earn3 from "../../assets/earn3.png";

const page = () => {
	return (

		<div className='grid grid-cols-1 w-full min-h-[100vh] bg-black '>
			<div className='flex justify-center my-[5%] items-center w-full'>
				<div className='sm:w-[85%] flex flex-col gap-6 md:w-[70%]'>
					<div className='flex sm:flex-row min-w-[50%] flex-col justify-center p-4 rounded-2xl bg-[#E0F7FA] items-center'>
						<div className='flex rounded-2xl md:px-11 flex-col gap-3'>
							<div className='text-3xl font-semibold'>Sell Products (Anytime)</div>
							<div className='sm:text-lg text-[#5C5F6] leading-6 sm:max-w-[85%] md:max-w-[70%]'>Showcase and sell your own products directly within your community. Whether it's handmade crafts, digital downloads, or exclusive merchandise, the possibilities are endless!</div>
						</div>
						<div className='flex justify-center items-center'>
							<Image src={earn1} className='md:max-w-[450px] sm:max-w-[350px]' />
						</div>
					</div>
					<div className='flex sm:flex-row-reverse flex-col justify-center p-4 rounded-2xl bg-[#ECECFE] items-center'>
						<div className='flex rounded-2xl min-w-[50%]  md:px-11 flex-col gap-3'>
							<div className='text-3xl font-semibold'>Community Ads</div>
							<div className='sm:text-lg text-[#5C5F6] leading-6 sm:max-w-[85%] md:max-w-[70%]'>Once your community reaches 500 members and a 10% popularity score, unlock the power of community ads.  Display targeted ads relevant to your audience and earn revenue with every impression or click. </div>
						</div>
						<div className='flex justify-center min-w-[50%] items-center'>
							<Image src={earn2} className='md:max-w-[450px] sm:max-w-[350px]' />
						</div>
					</div>
					<div className='flex sm:flex-row min-w-[50%]  flex-col justify-center p-4 rounded-2xl bg-[#FBE9E7] items-center'>
						<div className='flex rounded-2xl md:px-11 flex-col gap-3'>
							<div className='text-3xl font-semibold'>Paid Topics</div>
							<div className='sm:text-lg text-[#5C5F6] leading-6 sm:max-w-[85%] md:max-w-[70%]'>After unlocking topic creation (details within the grovyo communtiy & Workspace), create exclusive, in-depth content (guides, tutorials) and charge a fee for access. This allows you to directly monetize your expertise</div>
						</div>
						<div className='flex justify-center min-w-[50%]  items-center'>
							<Image src={earn3} className='md:max-w-[450px] sm:max-w-[350px]' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default page