import Image from "next/image";
import React from "react";
// import Empty from "../../assets/Images/chatk.png";

function page() {
  return (
    <div className="w-[100%] pn:max-md:hidden flex p-2 h-screen dark:bg-bluedark bg-white text-[#3e3e3e] flex-col justify-center items-center">
      <div className="flex bg-[#f9f9f9] dark:bg-bluelight p-4 py-6 rounded-2xl justify-center flex-col items-center">
        {/* <Image src={Empty} alt="empty" /> */}
        <div className="text-[18px] font-semibold dark:text-slate-200">Check your inbox</div>
        <div className="font-normal text-[14px] mt-2 dark:text-slate-400">Your personal messages are end-to-end encrypted</div>
      </div>
    </div>
  );
}

export default page;
