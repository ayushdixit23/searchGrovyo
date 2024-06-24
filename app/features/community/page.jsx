import Image from 'next/image'
import React from 'react'
import com1 from "../../assets/create.png"
import com2 from "../../assets/showproducts.png"
import com3 from "../../assets/thumb.png"
import topics23 from "../../assets/topics23.png"
import big from "../../assets/big.png"
import mont from "../../assets/mont.png"

const page = () => {
	return (
		<>
			<div className='bg-[#222222] h-auto overflow-y-scroll select-none text-white no-scrollbar grid grid-cols-1 w-full py-3 pb-[40px] px-2 sm:px-4'>
				<div className="grid grid-cols-1 w-full">
					<div className='text-3xl font-semibold p-3 sm:p-6'>
						Community
					</div>
					<div className='flex justify-center items-center p-3 w-full'>

						<Image src={big} className='sm:max-w-[670px]' />
					</div>
					<div className='flex justify-center mt-[30px] items-center'>
						<div className='flex flex-col justify-center items-center text-center gap-3'>
							<div className='sm:text-3xl sm:leading-snug text-xl leading-8 font-semibold sm:max-w-[65%]'>Build, Engage, Earn: A Step-by-Step Guide to Build Your Thriving Grovyo Community</div>
							<div className='text-[#FAFAFA] sm:text-lg'>Grovyo: Build your community, connect & earn.</div>
						</div>
					</div>
				</div>

				<div className='flex flex-col justify-center gap-4 sm:gap-[75px] items-center py-[5%] w-full h-full'>
					<div className='grid sm:grid-cols-2  gap-8 w-[90%] md:w-[80%]'>
						<div className='flex sm:relative sm:top-[60px]'>
							<div>
								<div className='text-2xl font-semibold'>Create Your Community :</div>
								<div>
									<ul className='list-disc pl-5 text-[#fafafa] text-sm flex flex-col gap-2 mt-3'>
										<li>Go to the "Community" section within your Grovyo app.</li>
										<li>Click on "Create Community" to begin.</li>
										<li>Choose a captivating name and a descriptive tagline for your community.</li>
										<li>Select a relevant category to attract the right audience.</li>
										<li>Decide whether you want a public community (open to all) or a private community (by invitation only).</li>
										<li>Hit "Create" and welcome your first members!</li>
									</ul>
								</div>
							</div>
						</div>

						<div className='min-w-[50%] flex justify-center items-center'>
							<Image src={com1} className='sm:max-w-[50%] sm:min-w-[400px] max-h-full' />
						</div>
					</div>

					<div className='grid sm:grid-cols-2 gap-8  w-[90%] md:w-[80%]'>
						<div className='flex sm:order-2 sm:relative sm:top-[60px]'>
							<div>
								<div className='text-2xl font-semibold'>Cultivate Engagement </div>
								<div>
									<ul className='list-disc pl-5 text-[#fafafa] text-sm flex flex-col gap-2 mt-3'>
										<li>Create Captivating Posts: Share text, images, videos, or polls to spark conversations and keep your members engaged.</li>
										<li>Respond to Comments and Messages:  Actively participate in Chats  and build relationships with your members.</li>

									</ul>
								</div>
							</div>
						</div>

						<div className='min-w-[50%] sm:order-1 flex justify-center items-center'>
							<Image src={com3} className='sm:max-w-[50%] sm:min-w-[400px] max-h-full' />
						</div>
					</div>

					<div className='grid sm:grid-cols-2 gap-8  w-[90%] md:w-[80%]'>
						<div className='flex sm:relative sm:top-[60px]'>
							<div>
								<div className='text-2xl font-semibold'>Unlock Topic Creation </div>
								<div>
									<ul className='list-disc pl-5 text-[#fafafa] text-sm flex flex-col gap-2 mt-3'>
										<li>As your community grows (over 150 members), you'll unlock the powerful "Topics" feature.</li>
										<li>Craft In-Depth Content: Create detailed guides, tutorials, or exclusive content to offer value to your members.</li>
										<li>Choose Free or Paid Topics: Decide whether to offer your content for free or charge a fee, allowing you to directly monetize your expertise.</li>

									</ul>
								</div>
							</div>
						</div>

						<div className='min-w-[50%] flex justify-center items-center'>
							<Image src={topics23} className='sm:max-w-[50%] sm:min-w-[400px] max-h-full' />
						</div>
					</div>

					<div className='grid sm:grid-cols-2 gap-8 w-[90%] md:w-[80%]'>
						<div className='flex sm:order-2 sm:relative sm:top-[60px]'>
							<div>
								<div className='text-2xl font-semibold'> Showcase Your Products (Anytime) </div>
								<div>
									<ul className='list-disc pl-5 text-[#fafafa] text-sm flex flex-col gap-2 mt-3'>
										<li>Sell your own products directly within your community. Whether it's handmade crafts, digital downloads, or exclusive merchandise, the possibilities are endless!</li>
									</ul>
								</div>
							</div>
						</div>

						<div className='min-w-[50%] flex justify-center items-center'>
							<Image src={com2} className='sm:max-w-[50%] sm:min-w-[400px] max-h-full' />
						</div>
					</div>

					<div className='grid sm:grid-cols-2 gap-8  w-[90%] md:w-[80%]'>
						<div className='flex sm:relative sm:top-[60px]'>
							<div>
								<div className='text-2xl font-semibold'>Monetize Your Community</div>
								<div>
									<ul className='list-disc pl-5 text-[#fafafa] text-sm flex flex-col gap-2 mt-3'>
										<li>Once your community reaches a certain size and popularity (specific requirements detailed within the app ), you'll unlock additional monetization options:</li>
										<li>Community Ads: Display targeted ads relevant to your audience and earn revenue with every impression or click.</li>
										<li>Paid Topics (Unlocked with Topic Creation):  Create exclusive content and charge a fee for access.</li>

									</ul>
								</div>
							</div>
						</div>

						<div className='min-w-[50%]  flex justify-center items-center'>
							<Image src={mont} className='sm:max-w-[50%] sm:min-w-[400px] max-h-full' />
						</div>
					</div>

				</div>

			</div >
		</>
	)
}

export default page