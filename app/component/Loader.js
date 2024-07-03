import React from 'react'
import { FiLoader } from "react-icons/fi";

const Loader = () => {
	return (
		<>
			<div className="z-50 h-screen w-full backdrop-blur-md flex justify-center items-center ">
				<div className="animate-spin">
					<FiLoader className="text-2xl dark:text-white" />
					{/* <AiOutlineLoading3Quarters className="text-2xl text-white" /> */}
				</div>
			</div>
		</>
	)
}

export default Loader