import React, { forwardRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { PiHandsClapping } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import Comments from "./Comments";

const CommunityPost = forwardRef(
  ({ d, i, title, handleLike, data, setShareValue, setShare }, ref) => {
    const [showComments, setShowComments] = useState(false);
    return (
      <>
        {showComments && (
          <div>
            <Comments
              id={data?.id}
              dp={data?.dp}
              fullname={data?.fullname}
              postId={d?.posts?._id}
            />
          </div>
        )}
        <div ref={ref} className="pt-2 pn:max-sm:p-3 p-4 pn:max-md:rounded-2xl">
          {/* POst */}
          <div className="bg-white dark:bg-bluedark p-2 max-w-[360px] rounded-xl">
            {/* header */}
            <div className="w-[100%] rounded-2xl flex flex-col items-center ">
              <div className=" w-[100%]  rounded-2xl flex flex-row items-center ">
                <div className=" flex object-scale-down rounded-2xl items-center h-[100%] ">
                  {/* <div className="h-[45px] w-[45px] rounded-2xl bg-slate-200 animate-pulse "></div> */}
                  <img
                    src={d?.dpdata}
                    className="h-[40px] w-[40px] rounded-2xl bg-white dark:bg-bluedark "
                  />
                </div>
                {/* Community name */}
                <div className="flex flex-col justify-center px-2 items-start">
                  <div className="flex flex-col ">
                    <div className="text-[14px] font-semibold">{title}</div>
                    <div className="font-medium text-[#414141] dark:text-[#f8f8f8] text-[12px]">
                      By {d?.posts?.sender?.fullname}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`h-[200px] mt-2 rounded-2xl light:bg-slate-200  ${
                d?.urls.length > 1 ? "overflow-x-scroll no-scrollbar" : null
              }  flex justify-center items-center `}
            >
              <>
                {d?.urls.length > 1 ? (
                  <>
                    {d?.urls.map((f) => (
                      <div className="h-full w-full min-w-[320px] ">
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
                    <div className="h-full w-full min-w-[320px] ">
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
            <div className=" px-2 mt-2 py-1 w-[100%] rounded-lg flex flex-col">
              <div className="text-[14px] truncate dark:text-[#f8f8f8] text-black w-full ">
                {d?.posts.title}
              </div>
              <div className="text-[14px] dark:text-[#f8f8f8] truncate">
                {d?.posts.desc}
              </div>
            </div>
            <div className=" px-2 mt-1  py-1 w-[100%] rounded-lg flex items-center">
              <div className="text-[14px] dark:text-[#f8f8f8] text-black w-full ">
                Liked by Divyansh
              </div>
              <div className="flex gap-2">
                <div
                  onClick={() => handleLike(d?.posts?._id, d?.liked)}
                  className={`  dark:bg-graydark flex justify-center rounded-xl ${
                    d?.liked
                      ? "bg-[#e0a648] dark:text-black dark:bg-yellow-300 text-white"
                      : "bg-[#f4f4f4]"
                  } items-center gap-1 p-2 `}
                >
                  <PiHandsClapping />
                  <div className="text-[12px]">{d?.posts?.likes}</div>
                </div>
                <div
                  onClick={() => {
                    setShareValue(
                      `https://grovyo.com/main/feed/newForYou/${d?.posts?.community?._id}#${d?.posts?._id}`
                    );
                    setShare(true);
                  }}
                  className="rounded-xl bg-[#f4f4f4] p-2 dark:bg-graydark"
                >
                  <VscSend />
                </div>
              </div>
            </div>
            {/* Add a comment */}
            {/* <div className=" px-2 mt-1  py-1 w-[100%] rounded-lg bg-slate-200  flex items-center">
						<div onClick={() => setShowComments(true)} className="text-[14px] text-black w-full ">
							comment .... .... ...
						</div>
					</div> */}
          </div>
        </div>
      </>
    );
  }
);

export default CommunityPost;
