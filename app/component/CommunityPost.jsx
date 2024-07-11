import React, { forwardRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { PiHandsClapping } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import Comments from "./Comments";
import { GoArrowRight } from "react-icons/go";
import liked from "../assets/liked.png";
import lightunlike from "../assets/lightunlike.png";
import darkunlike from "../assets/darkunlike.png";
import Image from "next/image";
import { useTheme } from "next-themes";

const CommunityPost = forwardRef(
  ({ d, i, title, handleLike, data, comId, setShareValue, setShare }, ref) => {
    const [showComments, setShowComments] = useState(false);
    const { theme } = useTheme();
    return (
      <>
        <div
          ref={ref}
          className="pt-2 pn:max-sm:p-3  w-full p-4 pn:max-md:rounded-2xl"
        >
          {d?.posts?.kind == "ad" && d?.posts?.community != comId ? (
            //ads
            <div
              className="bg-white 
          dark:bg-[#121212] border dark:border-none border-[#DEE1E5] p-3  rounded-xl"
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
                    <div className="flex flex-col gap-1">
                      <div className="text-[15px] font-semibold">
                        {d?.posts?.community?.title}
                      </div>
                      <div className="flex gap-1">
                        <div className="text-[10px] dark:text-[#f5f5f5] pn:max-sm:text-[10px] font-medium text-[#5C5C5C]">
                          By {d?.posts?.sender?.fullname}
                        </div>
                        <div className="text-[10px] dark:text-[#f5f5f5] font-bold text-[#5C5C5C]">
                          . Sponsored
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`h-[310px] mt-2 sm:pl-10 rounded-2xl light:bg-slate-200  ${
                  d?.urls.length > 1 ? "overflow-x-scroll no-scrollbar" : null
                }  flex  flex-col justify-start `}
              >
                <>
                  {d?.urls.length > 1 ? (
                    <>
                      {d?.urls.map((f) => (
                        <div className="h-full w-full max-w-[50%] bg-red-700 min-w-[320px] ">
                          {f?.type.startsWith("image") ? (
                            <div className="h-full w-full px-1">
                              <img
                                src={f?.content}
                                className="h-full  object-contain bg-black rounded-t-2xl w-full"
                              />
                            </div>
                          ) : (
                            <div className="flex w-full object-cover h-full">
                              <VideoPlayer
                                key={i}
                                poster={f?.thumbnail}
                                src={f?.content}
                                width={"100%"}
                                height={"h-full"}
                              />
                            </div>
                          )}
                          <div className="flex justify-start rounded-b-xl text-sm mx-1 bg-blue-700 animate-pulse text-white p-2 px-3 ">
                            <a
                              href={d?.posts?.ctalink}
                              target="_blank"
                              className="flex w-full  cursor-pointer items-center gap-2"
                            >
                              <div>{d?.posts?.cta}</div>
                              <div>
                                <GoArrowRight />
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="h-full w-full max-w-[50%]  min-w-[320px] ">
                        {d?.urls[0]?.type.startsWith("image") ? (
                          <div className="h-full w-full px-1">
                            <img
                              src={d?.urls[0]?.content}
                              className="h-full object-contain bg-black rounded-t-2xl w-full"
                            />
                          </div>
                        ) : (
                          <div className="flex w-full object-cover h-full">
                            <VideoPlayer
                              key={i}
                              src={d?.urls[0]?.content}
                              poster={d?.urls[0]?.thumbnail}
                              width={"100%"}
                              height={"h-full"}
                            />
                          </div>
                        )}
                        <div className="flex justify-start rounded-b-xl text-sm mx-1 bg-blue-700 animate-pulse text-white p-2 px-3 ">
                          <a
                            href={d?.posts?.ctalink}
                            target="_blank"
                            className="flex w-full  cursor-pointer items-center gap-2"
                          >
                            <div>{d?.posts?.cta}</div>
                            <div>
                              <GoArrowRight />
                            </div>
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </>
              </div>
              <div className=" px-2 mx-1 mt-10 sm:pl-10 py-1 w-[100%] rounded-lg gap-2  flex flex-col">
                <div className="sm:text-base text-[14px]  truncate font-semibold dark:text-[#f8f8f8] text-black w-full ">
                  {d?.posts.title}
                </div>
                <div className="text-[14px] dark:text-[#f8f8f8] truncate">
                  {d?.posts.desc}
                </div>
              </div>
            </div>
          ) : (
            // Post
            <div
              className="bg-white 
          dark:bg-[#121212] border dark:border-none border-[#DEE1E5] p-2 sm:p-3  rounded-xl"
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
                className={`h-[270px] sm:h-[310px] mt-2 sm:pl-10 rounded-2xl light:bg-slate-200  ${
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
                                poster={f?.thumbnail}
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
                              poster={d?.urls[0]?.thumbnail}
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
              <div className=" px-2 mt-2 sm:pl-10 py-1 w-[100%] rounded-lg gap-2  flex flex-col">
                <div className="sm:text-base text-[14px]  truncate font-semibold dark:text-[#f8f8f8] text-black w-full ">
                  {d?.posts.title}
                </div>
                <div className="text-[14px] dark:text-[#f8f8f8] truncate">
                  {d?.posts.desc}
                </div>
              </div>
              <div className="sm:px-2 sm:pl-10 mt-1  py-1 w-[100%] rounded-lg flex gap-2 items-center">
                <div
                  onClick={() => setShowComments(true)}
                  className="text-sm border border-[#D7EDED] dark:border-[#292929] p-2 dark:bg-[#171717] rounded-xl text-k dark:text-white w-full "
                >
                  View Comments
                </div>
                <div className="flex items-center gap-1">
                  <div
                    onClick={() => handleLike(d?.posts?._id, d?.liked)}
                    className={`dark:bg-graydark flex justify-center rounded-xl ${
                      d?.liked ? "dark:text-white " : ""
                    } items-center border dark:border-[#1A1D21] gap-1 p-2 px-4`}
                  >
                    {d?.liked ? (
                      <Image src={liked} className="w-[20px] h-[20px]" />
                    ) : theme == "dark" ? (
                      <Image src={darkunlike} className="w-[20px] h-[20px]" />
                    ) : (
                      <Image src={lightunlike} className="w-[20px] h-[20px]" />
                    )}
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
          )}
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
