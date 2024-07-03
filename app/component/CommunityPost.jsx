import React, { forwardRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { PiHandsClapping } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import Comments from "./Comments";

const CommunityPost = forwardRef(
  ({ d, i, title, handleLike, data, comId, setShareValue, setShare }, ref) => {
    const [showComments, setShowComments] = useState(false);

    return (
      <>
        <div
          ref={ref}
          className="pt-2 pn:max-sm:p-3  w-full p-4 pn:max-md:rounded-2xl"
        >
          {/* POst */}
          <div
            className="bg-white 
          dark:bg-[#121212] border border-[#DEE1E5] p-3  rounded-xl"
          >
            {/* header */}
            <div className="w-[100%] rounded-2xl flex flex-col items-center ">
              <div className=" w-[100%] gap-2 rounded-2xl flex flex-row items-center ">
                <div className=" flex object-scale-down rounded-2xl items-center h-[100%] ">
                  {/* <div className="h-[45px] w-[45px] rounded-2xl bg-slate-200 animate-pulse "></div> */}
                  <img
                    src={d?.dpdata}
                    className="h-[40px] w-[40px] rounded-2xl object-cover bg-white dark:bg-bluedark "
                  />
                </div>
                {/* Community name */}
                <div className="flex flex-col justify-center px-2 items-start">
                  <div className="flex flex-col ">
                    {/* <div className="text-[14px] font-semibold">{title}</div> */}
                    <div className="font-semibold text-[#414141] dark:text-[#f8f8f8] text-[15px]">
                      {d?.posts?.sender?.fullname}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`h-[310px] mt-2 pl-10 rounded-2xl light:bg-slate-200  ${
                d?.urls.length > 1 ? "overflow-x-scroll no-scrollbar" : null
              }  flex justify-start items-center `}
            >
              <>
                {d?.urls.length > 1 ? (
                  <>
                    {d?.urls.map((f) => (
                      <div className="h-full w-full max-w-[50%] min-w-[320px] ">
                        {f?.type.startsWith("image") ? (
                          <div className="h-full w-full p-1">
                            <img
                              src={f?.content}
                              className="h-full  object-contain bg-black rounded-2xl w-full"
                            />
                          </div>
                        ) : (
                          <div className="flex w-full object-cover h-full">
                            <VideoPlayer
                              key={i}
                              src={f?.content}
                              width={"100%"}
                              height={"h-full"}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="h-full w-full max-w-[50%] min-w-[320px] ">
                      {d?.urls[0]?.type.startsWith("image") ? (
                        <div className="h-full w-full p-1">
                          <img
                            src={d?.urls[0]?.content}
                            className="h-full object-contain bg-black rounded-2xl w-full"
                          />
                        </div>
                      ) : (
                        <div className="flex w-full object-cover h-full">
                          <VideoPlayer
                            key={i}
                            src={d?.urls[0]?.content}
                            width={"100%"}
                            height={"h-full"}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            </div>
            <div className=" px-2 mt-2 pl-10 py-1 w-[100%] rounded-lg gap-2  flex flex-col">
              <div className="sm:text-base text-[14px]  truncate font-semibold dark:text-[#f8f8f8] text-black w-full ">
                {d?.posts.title}
              </div>
              <div className="text-[14px] dark:text-[#f8f8f8] truncate">
                {d?.posts.desc}
              </div>
            </div>
            <div className="px-2 pl-10 mt-1  py-1 w-[100%] rounded-lg flex gap-2 items-center">
              <div
                onClick={() => setShowComments(true)}
                className="text-sm border border-[#D7EDED] dark:border-[#292929] p-2 dark:bg-[#171717] rounded-xl text-k dark:text-white w-full "
              >
                View Comments
              </div>
              <div className="flex gap-2">
                <div
                  onClick={() => handleLike(d?.posts?._id, d?.liked)}
                  className={`  dark:bg-graydark flex justify-center rounded-xl ${
                    d?.liked
                      ? "bg-[#e0a648] dark:text-black dark:bg-yellow-300 text-white"
                      : "bg-[#f4f4f4] dark:border dark:border-[#1A1D21]"
                  } items-center gap-1 p-2 `}
                >
                  <PiHandsClapping />
                  <div className="text-[12px]">{d?.posts?.likes}</div>
                </div>
                <div
                  onClick={() => {
                    setShareValue(
                      `https://grovyo.com/main/feed/newForYou/${comId}#${d?.posts?._id}`
                    );
                    setShare(true);
                  }}
                  className="rounded-xl bg-[#f4f4f4] p-2 dark:bg-graydark"
                >
                  <VscSend />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showComments && (
          <div className=" p-4  rounded-2xl">
            <Comments
              key={i}
              setShowComments={setShowComments}
              id={data?.id}
              dp={data?.dp}
              fullname={data?.fullname}
              postId={d?.posts?._id}
            />
          </div>
        )}
      </>
    );
  }
);

export default CommunityPost;
