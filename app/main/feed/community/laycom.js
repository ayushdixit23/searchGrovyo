"use client";
// import Empty from "../../../assets/Images/community.png";
import { useAuthContext } from "../../../utils/AuthWrapper";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../Essentials";
import Link from "next/link";
// import { MediaPlayer, MediaProvider } from "@vidstack/react";
// import {
//   DefaultVideoLayout,
//   defaultLayoutIcons,
// } from "@vidstack/react/player/layouts/default";
import styles from "../../../CustomScrollbarComponent.module.css";
import { VscSend } from "react-icons/vsc";
import { PiHandsClapping } from "react-icons/pi";
import { socketemitfunc, useSocketContext } from "../../../utils/SocketWrapper";
import { formatDate } from "../../../utils/useful";
import toast from "react-hot-toast";
import VideoPlayer from "@/app/component/VideoPlayer";
import { useSearchParams } from "next/navigation";
import CommunityFeed from "@/app/component/CommunityFeed";
import { setHide } from "@/app/redux/slice/remember";
import { useDispatch } from "react-redux";

export default function CommunityLayout({ children }) {
  const { data } = useAuthContext();
  const { socket } = useSocketContext();
  const [shareValue, setShareValue] = useState("");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isMobile, setIsMobile] = useState(false);
  const [share, setShare] = useState(false);

  const dispatch = useDispatch();
  const [feed, setFeed] = useState([]);

  const comfetchfeed = async () => {
    try {
      const res = await axios.get(`${API}/joinedcomnews3/${data?.id}`);
      console.log(res.data, "com");
      setFeed(res.data?.mergedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (postId, liked) => {
    try {
      const randomNumber = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      socketemitfunc({
        event: "adviews",
        data: {
          postId: postId,
          imp: randomNumber,
          click: 1,
          userId: data?.id,
          inside: false,
        },
        socket,
      });
      const res = await axios.post(`${API}/likepost/${data?.id}/${postId}`);
      if (res.data.success) {
        // if (liked) {
        //   const newwfeed = feed.map((d) =>
        //     d?.posts._id === postId ? { ...d, liked: false, posts: { ...d.posts, likes: Number(d?.posts?.likes) - 1 } } : d
        //   );
        //   setFeed(newwfeed);
        // } else {
        //   const newwfeed = feed.map((d) =>
        //     d?.posts._id === postId ? { ...d, liked: true, posts: { ...d.posts, likes: Number(d?.posts?.likes) + 1 } } : d
        //   );
        //   setFeed(newwfeed);
        // }

        const newFeed = feed.map((d) => {
          if (d.posts[0]?._id === postId) {
            const newLikes = liked
              ? Number(d.posts[0].likes) - 1
              : Number(d.posts[0].likes) + 1;
            return {
              ...d,
              liked: !liked,
              posts: [
                {
                  ...d.posts[0],
                  likes: newLikes,
                },
              ],
            };
          }
          return d;
        });
        setFeed(newFeed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareValue).then(() => {
      toast.success("Copied!");
    });
  };

  useEffect(() => {
    const initialWidth = window.innerWidth;
    if (initialWidth > 821) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const initialWidth = window.innerWidth;
      if (initialWidth > 821) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (data.id) {
      comfetchfeed();
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      dispatch(setHide(true));
    }
  }, [searchParams, id]);

  useEffect(() => {
    if (!searchParams.get("id")) {
      dispatch(setHide(false));
    }
  }, [searchParams, id]);

  return (
    <>
      {share && (
        <div
          id="course-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center w-screen md:inset-0 h-screen max-h-full"
        >
          <div className="relative p-4 flex justify-center items-center w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow  dark:bg-bluelight">
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-lg text-gray-500 dark:text-white">
                  Share course
                </h3>
                <button
                  type="button"
                  onClick={() => setShare(false)}
                  className="text-gray-400 hover:dark:bg-gray-400   hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center "
                  data-modal-toggle="course-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="px-4 pb-4 md:px-5 md:pb-5">
                <label
                  for="course-url"
                  className="text-sm dark:text-slate-300 font-medium text-gray-900 mb-2 block"
                >
                  Share the course link below with your friends:
                </label>
                <div className="flex justify-center dark:bg-bluelight  items-center  border rounded-lg bg-transparent border-gray-300 text-gray-500 mb-4">
                  <input
                    id="course-url"
                    type="text"
                    className="col-span-6 dark:bg-bluelight  dark:text-selectdark rounded-lg  text-sm  block w-full p-2.5 "
                    value={shareValue}
                    disabled
                    readonly
                  />
                  <button
                    onClick={handleCopyToClipboard}
                    data-copy-to-clipboard-target="course-url"
                    data-tooltip-target="tooltip-course-url"
                    className=" p-2 inline-flex items-center justify-center"
                  >
                    <span id="default-icon-course-url">
                      <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                      </svg>
                    </span>
                    <span
                      id="success-icon-course-url"
                      className="hidden inline-flex items-center"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-blue-700 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    id="tooltip-course-url"
                    role="tooltip"
                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip "
                  >
                    <span id="default-tooltip-message-course-url">
                      Copy to clipboard
                    </span>
                    <span
                      id="success-tooltip-message-course-url"
                      className="hidden"
                    >
                      Copied!
                    </span>
                    <div className="tooltip-arrow" data-popper-arrow></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*if no data*/}
      {!id && (
        <div className="w-[100%] h-screen bg-white dark:bg-graydark flex pn:max-md:justify-center ">
          <div className=" select-none md:min-w-[390px] lg:w-[360px] flex flex-col items-center md:border-r-2 border-[#f7f7f7] self-end ">
            <div className="h-[8vh] pn:max-sm:h-[16vh]"></div>

            <div
              className={`h-[92vh] pn:max-sm:h-[87vh] ${styles.customScrollbar} overflow-auto `}
            >
              {/* post 1*/}
              <div className=" w-full p-2">
                <div className="bg-com-image bg-cover bg-center bg-no-repeat bg-black dark:bg-[#7d8ba8] rounded-xl p-2 text-white text-center h-[140px] flex flex-col justify-evenly items-center">
                  <div className="font-semibold">Don't have a community ?</div>
                  <div className="text-[12px] w-[85%]">
                    Create your own community and invite your friends and people
                  </div>
                  <a
                    target="_blank"
                    href={`https://workspace.grovyo.com/aybdhw?zyxxpht=${data?.id}&path=/main/community/createCommunity`}
                    className="bg-white text-[12px] text-black mt-2 p-2 rounded-xl"
                  >
                    Create now
                  </a>
                </div>
              </div>
              {feed.map((d, i) => (
                <div key={i} className={`pn:max-md:rounded-2xl w-full px-2`}>
                  <Link
                    onClick={() => {
                      if (isMobile) {
                        dispatch(setHide(true));
                      }
                    }}
                    href={
                      isMobile
                        ? `/main/feed/community?id=${d?.community?._id}`
                        : `/main/feed/community/${d?.community?._id}`
                    }
                    className="w-[100%] bg-white dark:bg-graydark flex px-1 justify-between items-center "
                  >
                    <div className="h-[55px] pn:max-sm:h-[50px] flex flex-row items-center ">
                      <div className=" flex object-scale-down items-center ">
                        <img
                          src={d?.dps}
                          className="h-[35px] w-[35px] dark:ring-[#273142] pn:max-sm:w-[30px] pn:max-sm:h-[30px] 
													pn:max-sm:rounded-[13px] rounded-[15px] ring-1 ring-white bg-white dark:bg-graydark "
                        />
                      </div>
                      {/* Community name */}
                      <div className="flex flex-col justify-center px-2 items-start ">
                        <div className="flex flex-col space-y-[0.5px] justify-start items-start">
                          <div className="text-[14px] dark:text-[#f5f5f5] pn:max-sm:text-[12px] font-semibold">
                            {d?.community?.title}
                          </div>
                          <div className="flex">
                            <div className="text-[10px] dark:text-[#f5f5f5] pn:max-sm:text-[10px] font-medium text-[#5C5C5C]">
                              By {d?.community?.creator?.fullname}
                            </div>
                            <div className="dark:text-[#f5f5f5] text-[10px] font-medium text-[#5C5C5C]">
                              {/* . {formatDate(d?.posts?.createdAt)} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Animation of join nd bell */}
                    {/* {d?.subs === "unsubscribed" ? (
                     
                      ) : (
                        <div
                          onClick={() => unjoinmembers(d?.posts?.community._id)}
                          className="  rounded-xl text-[14px] text-[#5c5c5c]"
                        ></div>
                      )} */}
                    {/* <div className="bg-[#f5f5f5] p-2 px-4 rounded-xl pn:max-sm:text-[12px] font-medium text-[14px] text-[#5c5c5c]">
                  Join
                </div> */}
                  </Link>

                  {/* POst */}
                  <Link
                    onClick={() => {
                      if (isMobile) {
                        dispatch(setHide(true));
                      }
                    }}
                    href={
                      isMobile
                        ? `/main/feed/community?id=${d?.community?._id}`
                        : `/main/feed/community/${d?.community?._id}`
                    }
                    className=""
                  >
                    <div className="bg-[#e4e4e4] dark:bg-graydark rounded-xl w-full flex flex-col justify-center items-center ">
                      <>
                        {d?.urls.length > 1 ? (
                          <>
                            {d?.urls.map((f) => (
                              <div className="sm:h-[260px] h-[300px] w-full rounded-xl ">
                                {f?.type.startsWith("image") ? (
                                  <div className="h-full w-full p-1">
                                    <img
                                      src={f?.content}
                                      className="h-full object-contain bg-black rounded-2xl w-full"
                                    />
                                  </div>
                                ) : (
                                  // <div className="p-1 h-full">
                                  //   <div className=" rounded-2xl h-full relative overflow-hidden">
                                  //     <div className="absolute z-10 h-[300px] sm:h-[260px] w-full"></div>
                                  //     <MediaPlayer
                                  //       src={f?.content}
                                  //       onQualitiesChange={480}
                                  //       className="z-0 h-[300px] sm:h-[260px]"
                                  //     >
                                  //       <MediaProvider />
                                  //       <DefaultVideoLayout
                                  //         thumbnails={f?.content}
                                  //         icons={defaultLayoutIcons}
                                  //       />
                                  //     </MediaPlayer>
                                  //   </div>
                                  // </div>
                                  <div className="flex w-full  h-full">
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
                            <div className="sm:h-[260px] h-[300px] w-full rounded-xl ">
                              {d?.urls[0]?.type.startsWith("image") ? (
                                <div className="h-full w-full p-1">
                                  <img
                                    src={d?.urls[0]?.content}
                                    className="h-full object-contain bg-black rounded-2xl w-full"
                                  />
                                </div>
                              ) : (
                                // <div className="p-1 h-full">
                                //   <div className=" rounded-2xl h-full relative overflow-hidden">
                                //     <div className="absolute z-10 h-[300px] sm:h-[260px] w-full "></div>
                                //     <MediaPlayer
                                //       src={d?.urls[0]?.content}
                                //       onQualitiesChange={480}
                                //       className="z-0 h-[300px] sm:h-[260px]"
                                //     >
                                //       <MediaProvider />
                                //       <DefaultVideoLayout
                                //         thumbnails={d?.urls[0]?.content}
                                //         icons={defaultLayoutIcons}
                                //       />
                                //     </MediaPlayer>
                                //   </div>
                                // </div>
                                <div className="flex w-full  h-full">
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
                      <div className="h-[20px] sm:h-[25px] px-2 w-[100%] flex flex-col">
                        <div className="text-[14px] pn:max-sm:text-[12px] dark:text-[#f5f5f5] text-black w-[100%] font-medium text-ellipsis overflow-hidden px-1">
                          {d?.posts[0]?.title}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-2 w-full h-[40px] flex justify-between items-center">
                    <div className="flex flex-row gap-2 items-center  w-[100%]">
                      <div className="flex flex-row justify-start mt-1 ">
                        <div className="h-[20px] w-[20px] rounded-lg z-30 bg-slate-200 ">
                          <img
                            src={d?.memdps[0]}
                            className="h-[20px] w-[20px] rounded-2xl bg-yellow-300 "
                          />
                        </div>
                        <div className="h-[20px] w-[20px] rounded-lg z-20 -ml-[10px] bg-slate-300 ">
                          {" "}
                          <img
                            src={d?.memdps[1]}
                            className="h-[20px] w-[20px] rounded-2xl bg-yellow-300 "
                          />
                        </div>
                        <div className="h-[20px] w-[20px] rounded-lg z-10 -ml-[10px] bg-slate-400 ">
                          {" "}
                          <img
                            src={d?.memdps[2]}
                            className="h-[20px] w-[20px] rounded-2xl bg-yellow-300 "
                          />
                        </div>
                        <div className="h-[20px] w-[20px] rounded-lg z-0 -ml-[10px] bg-slate-500 ">
                          {" "}
                          <img
                            src={d?.memdps[3]}
                            className="h-[20px] w-[20px] rounded-2xl bg-yellow-300 "
                          />
                        </div>
                      </div>
                      <div className="text-[12px] self-center mt-1 font-medium">
                        {d?.posts?.community?.memberscount}
                        <span> Member</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div
                        onClick={() => handleLike(d?.posts[0]?._id, d?.liked)}
                        className={`flex justify-center rounded-xl items-center gap-1 ${
                          d?.liked
                            ? "bg-[#bc7e36] dark:text-black dark:bg-yellow-300 text-white"
                            : "bg-[#f4f4f4] dark:bg-bluedark"
                        }  p-2`}
                      >
                        <PiHandsClapping />
                        <div className="text-[12px]">{d?.posts[0]?.likes}</div>
                      </div>
                      <div
                        onClick={() => {
                          setShareValue(
                            `http://localhost:3000/main/feed/newForYou/${d?.posts?.community?._id}#${d?.posts?._id}`
                          );
                          setShare(true);
                        }}
                        className="rounded-xl bg-[#f4f4f4] p-2 dark:bg-bluedark "
                      >
                        <VscSend />
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b-[0.5px] mt-2"></div>
                </div>
              ))}
            </div>

            {/* POst */}
          </div>

          <div className="w-full pn:max-sm:hidden"> {children}</div>
        </div>
      )}
      {id && <CommunityFeed id={id} />}
    </>
  );
}
