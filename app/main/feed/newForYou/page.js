// import Image from "next/image";
// import Empty from "../../../assets/Images/community.png";
import React from 'react'

function page() {
  return (
    <div className="w-[100%] pn:max-md:hidden h-screen flex p-2 bg-white dark:bg-bluedark text-[#3e3e3e] flex-col justify-center items-center">
      <div className="flex bg-[#f9f9f9]  dark:bg-bluelight p-4 py-6 rounded-2xl justify-center flex-col items-center">
        {/* <Image src={Empty} alt="empty" /> */}
        <div className="text-[20px] font-bold dark:text-slate-200">
          Open Community To see Posts
        </div>
        <div className="font-medium mt-2 dark:text-slate-400" >No messages in your inbox</div>
      </div>
    </div>
  )
}

export default page