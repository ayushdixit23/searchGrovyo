"use client";
import { useAuthContext } from "@/app/utils/AuthWrapper";
import React from "react";

const SettingCommunity = () => {
  const { data } = useAuthContext();
  return (
    <div className="dark:bg-[#0D0D0D] pn:max-sm:mt-[59px] sm:h-full p-4 sm:p-6">
      <div className="h-full ">
        <div className="dark:bg-[#0D0F10] bg-[#fafafa] flex flex-col gap-5  p-5 rounded-xl">
          <div className="font-semibold text-sm">Community Analytics</div>
          <a
            target="_blank"
            href={`https://workspace.grovyo.com/aybdhw?zyxxpht=${data?.id}&path=/main/dashboard`}
            className=" font-medium underline text-sm"
          >
            View Analytics{" "}
          </a>
          <div className="font-medium text-xs max-w-[80%] text-[#6C737F]">
            Discover Community Analytics for in-depth insights into member
            activity, popularity, and demographics. Explore various ways to
            boost your earnings with our comprehensive analytics tools.
          </div>
        </div>
        <div className="dark:bg-[#0D0F10] bg-[#fafafa] mt-6 flex flex-col gap-5  p-5 rounded-xl">
          <div className="font-semibold text-sm">Interests</div>
          <div className=" font-medium underline text-sm">Update Interest</div>
          <div className="font-medium text-xs max-w-[80%] text-[#6C737F]">
            You can easily change your interests to personalize your feed. Just
            update your preferences and enjoy content tailored to you!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingCommunity;
