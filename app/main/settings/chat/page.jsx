import React from "react";

const SettingChat = () => {
  return (
    <div className="dark:bg-[#0D0D0D] pn:max-sm:mt-[60px] sm:h-full p-6">
      <div className="h-full ">
        <div className="dark:bg-[#0D0F10] bg-[#fafafa] flex flex-col gap-5  p-5 rounded-xl">
          <div className="font-semibold text-sm">Blocked Users</div>
          <div className=" font-medium underline text-sm">Block users </div>
          <div className="font-medium text-sm text-[#6C737F]">
            Blocked users will no longer be allowed to: Join your Communities,
            see your Posts in their feed, comment on your Communities, and
            message you.
          </div>
          <div className="font-medium text-sm ">
            You haven't blocked any users
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingChat;
