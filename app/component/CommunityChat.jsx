import React, { useEffect, useRef, useState } from "react";
import {
  setReplyFunction,
  setType,
  setMessages,
} from "../redux/slice/comChatSlice";
import axios from "axios";
import { API } from "@/Essentials";
import VideoPlayer from "./VideoPlayer";
import { socketemitfunc } from "../utils/SocketWrapper";
import deletechat from "../assets/deletechat.png";
import replypic from "../assets/replypic.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";

const CommunityChat = ({ d, i, data, dispatch, tId, socket, messages }) => {
  const [click, setClick] = useState(false);
  const [delopen, setDelopen] = useState(false);
  const [msgId, setMsgId] = useState(null);

  const deletepopUp = (mesId) => {
    try {
      setMsgId(Number(mesId));
      setDelopen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [popupPosition, setPopupPosition] = useState("bottom"); // State to track popup position

  const iconRef = useRef(null);
  const handleIconClick = () => {
    const iconRect = iconRef.current.getBoundingClientRect();
    const iconBottom = iconRect.bottom;
    if (window.innerHeight - iconBottom < 200) {
      setPopupPosition("top");
    } else {
      setPopupPosition("bottom");
    }
  };

  const limitWords = (text, wordLimit) => {
    // const words = text.split(" ");
    return text.length > wordLimit ? text.slice(0, wordLimit) + ".." : text;
  };

  useEffect(() => {
    if (!click) {
      setPopupPosition("bottom"); // Reset popup position when click is false
    }
  }, [click]);

  const handleDelete = async (action) => {
    try {
      if (action === "everyone") {
        socketemitfunc({
          event: "deleteforeveryone",
          data: { roomId: tId, userId: data?.id, data: msgId },
          socket,
        });
        const updatedMessages = messages.map((f, h) => {
          if (f?.mesId === msgId) {
            return { ...f, status: "deleted" };
          }
          return f;
        });
        dispatch(setMessages(updatedMessages));
      } else {
        const updatedMessages = messages.filter((f) => f?.mesId !== msgId);

        dispatch(setMessages(updatedMessages));
      }

      setDelopen(false);
      const res = await axios.post(
        `${API}/web/deletemessagestopic/${data?.id}`,
        {
          topicId: tId,
          msgIds: msgId,
          action,
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {delopen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
          <div className="bg-white dark:bg-bluedark p-6 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 ease-out scale-95">
            <h2 className="text-2xl font-bold mb-4">Delete Message</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this message?
            </p>
            <div className="flex flex-col justify-end items-end gap-3 ">
              {data?.id === d?.sender?._id && (
                <button
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleDelete("everyone")}
                >
                  Delete for Everyone
                </button>
              )}
              <button
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                onClick={() => handleDelete("me")}
              >
                Delete for Me
              </button>
              <button
                className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                onClick={() => {
                  setDelopen(false);
                  setMsgId("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        onClick={() => setClick(false)}
        className={`fixed inset-0 w-screen h-screen ${
          click ? "z-40" : "-z-20"
        }`}
      ></div>

      {/* community chats */}

      {/* community chats */}

      <div
        key={i}
        className={`flex gap-2 my-5 ${
          data?.id === d?.sender?._id ? "justify-end" : "justify-start"
        }  w-full items-start`}
      >
        {data?.id !== d?.sender?._id && (
          <div className="flex flex-col items-center justify-center">
            {data?.id !== d?.sender?._id && (
              <div className="h-[40px] w-[40px] overflow-hidden bg-[#fff] rounded-2xl">
                <img src={d?.dp} className="w-full object-cover h-full" />
              </div>
            )}

            <div className="text-[14px] mt-1">{d?.timestamp}</div>
          </div>
        )}
        <div className="flex flex-col gap-2 items-centers ">
          <div>{d?.sender?.fullname}</div>

          {d?.typ === "message" && (
            <div
              onDoubleClick={() => {
                if (d?.status != "deleted") {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }
              }}
              className={`relative group w-auto h-auto flex justify-start items-center ${
                data?.id === d?.sender?._id
                  ? "bg-[#5585FF] text-white p-2 px-4 md:text-[14px]  rounded-l-2xl pn:max-sm:text-[14px] max-w-[650px] rounded-br-2xl "
                  : "bg-[#ffffff] text-[#9B9C9E] font-medium border dark:border-none border-[#DEE1E5]  dark:bg-[#1A1D21] p-2 px-4 rounded-r-2xl md:text-[14px] pn:max-sm:text-[14px] max-w-[650px] rounded-bl-2xl"
              } `}
              style={{
                overflowWrap: "break-word",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <div className="">
                {d.status === "deleted" ? (
                  <div className="italic px-2">This Message was Deleted!</div>
                ) : (
                  <>
                    {d?.text?.match(/https:\/\/[^\s]+/g)
                      ? d?.text
                          .split(/(https:\/\/[^\s]+)/g)
                          .map((part, index) =>
                            part.match(/https:\/\/[^\s]+/g) ? (
                              <a
                                key={index}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={
                                  part.endsWith(".pdf") || part.endsWith(".zip")
                                    ? part
                                    : undefined
                                }
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                                className="md:text-[14px] pn:max-sm:text-[14px] "
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.textDecoration =
                                    "underline")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.textDecoration =
                                    "none")
                                }
                              >
                                {part}
                              </a>
                            ) : (
                              part
                            )
                          )
                      : d?.text}
                  </>
                )}
              </div>

              {d?.status !== "deleted" && (
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={` relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} className="" />
                </div>
              )}
              <div
                className={`flex flex-col gap-1 absolute z-40 ${
                  data?.id === d?.sender?._id
                    ? "right-0"
                    : "left-0 bg-[#f3f3f3]"
                }   shadow-2xl  text-black  duration-100
              ${
                popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
              }
                ${
                  click === true
                    ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                    : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                } `}
              >
                <div
                  onClick={() => {
                    dispatch(setType("reply"));
                    dispatch(
                      setReplyFunction({
                        reply: d?.text,
                        replyId: d?.mesId,
                      })
                    );
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={replypic}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Reply</div>
                </div>

                <div
                  onClick={() => {
                    deletepopUp(d?.mesId);
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={deletechat}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Delete</div>
                </div>
              </div>
            </div>
          )}

          {d?.typ === "reply" && (
            <div
              // onClick={() => handleScrollToMessage(d?.mesId)}
              onDoubleClick={() => {
                if (d?.status != "deleted") {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }
              }}
              className={`relative group h-auto  flex justify-center items-center ${
                data?.id === d?.sender?._id
                  ? "bg-[#5585FF]  text-white  rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
                  : "bg-[#ffffff] text-[#9B9C9E] font-medium border border-[#DEE1E5] dark:border-none dark:bg-[#1A1D21] rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
              }`}
            >
              <div className="p-2">
                {d.status === "deleted" ? (
                  <div>This Message was Deleted!</div>
                ) : (
                  <>
                    {d?.text?.match(/https:\/\/[^\s]+/g) ? (
                      d?.text.split(/(https:\/\/[^\s]+)/g).map((part, index) =>
                        part.match(/https:\/\/[^\s]+/g) ? (
                          <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={
                              part.endsWith(".pdf") || part.endsWith(".zip")
                                ? part
                                : undefined
                            }
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.textDecoration =
                                "underline")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.textDecoration = "none")
                            }
                          >
                            {part}
                          </a>
                        ) : (
                          <div key={index}>
                            <div className="dark:bg-[#ododod] bg-white p-1 rounded-lg">
                              {d?.reply}
                            </div>
                            <div>{part}</div>
                          </div>
                        )
                      )
                    ) : (
                      <div>
                        <div
                          className={` ${
                            data?.id === d?.sender?._id
                              ? "bg-[#0058e5] text-white  border-r-4 border-[#fff] "
                              : "bg-[#f9fafb] dark:bg-[#0D0D0D] dark:text-white text-black border-l-4 border-[#5585FF] "
                          }  px-2  p-1 rounded-lg md:text-[12px] pn:max-sm:text-[12px] `}
                          style={{
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                        >
                          {limitWords(d?.reply, 150)}
                        </div>
                        <div
                          style={{
                            overflowWrap: "break-word",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                          className="md:text-[14px] pn:max-sm:text-[14px] py-1 px-2 "
                        >
                          {d?.text}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {d?.status !== "deleted" && (
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={` relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} className="" />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 absolute z-40 ${
                  data?.id === d?.sender?._id
                    ? "right-0"
                    : "left-0 bg-[#f3f3f3]"
                }   shadow-2xl  text-black  duration-100
                ${
                  popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                }
                  ${
                    click === true
                      ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                      : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                  } `}
              >
                <div
                  onClick={() => {
                    dispatch(setType("reply"));
                    dispatch(
                      setReplyFunction({
                        reply: d?.text,
                        replyId: d?.mesId,
                      })
                    );
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={replypic}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Reply</div>
                </div>

                <div
                  onClick={() => {
                    deletepopUp(d?.mesId);
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={deletechat}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Delete</div>
                </div>
              </div>
            </div>
          )}

          {d?.typ == "image" && (
            <div
              onDoubleClick={() => {
                if (d?.status != "deleted") {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: "Image", replyId: d?.mesId })
                  );
                }
              }}
              className={`relative max-w-[240px] group ${
                data?.id === d?.sender?._id
                  ? "bg-[#5585FF] text-white p-2  rounded-l-2xl mt-4 rounded-br-2xl "
                  : "bg-[#ffffff] text-[#9B9C9E] font-medium border border-[#DEE1E5] dark:border-none dark:bg-[#1A1D21] p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
              }`}
            >
              <div
                className={`${
                  data?.id === d?.sender?._id
                    ? "group-hover:pr-2"
                    : "group-hover:pl-2"
                }`}
              >
                {d.status === "deleted" ? (
                  <div>This Message was Deleted!</div>
                ) : (
                  <div className="">
                    <img
                      src={d?.url}
                      className="h-[145px] sm:w-[240px] sm:h-[240px] w-[145px] rounded-2xl  bg-white "
                    />
                    {d?.text && (
                      <div
                        className={`${
                          data?.id === d?.sender?._id
                            ? "text-white"
                            : "text-black"
                        } md:text-[14px]  py-1   pn:max-sm:text-[14px] `}
                        style={{
                          overflowWrap: "break-word",
                          wordWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {d?.text}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {d?.status !== "deleted" && (
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={` relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} className="" />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 absolute z-40 ${
                  data?.id === d?.sender?._id
                    ? "right-0"
                    : "left-0 bg-[#f3f3f3]"
                }   shadow-2xl  text-black  duration-100
                ${
                  popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                }
                  ${
                    click === true
                      ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                      : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                  } `}
              >
                <div
                  onClick={() => {
                    dispatch(setType("reply"));
                    dispatch(
                      setReplyFunction({
                        reply: "Image",
                        replyId: d?.mesId,
                      })
                    );
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={replypic}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Reply</div>
                </div>

                <div
                  onClick={() => {
                    deletepopUp(d?.mesId);
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={deletechat}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Delete</div>
                </div>
              </div>
            </div>
          )}

          {d?.typ == "video" && (
            <div
              onDoubleClick={() => {
                if (d?.status != "deleted") {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: "Video", replyId: d?.mesId })
                  );
                }
              }}
              className={`relative max-w-[250px] max-h-[250px] group ${
                data?.id === d?.sender?._id
                  ? " bg-[#5585FF] text-white mt-4 flex justify-center items-center p-2 rounded-l-2xl rounded-br-2xl"
                  : "bg-[#ffffff] dark:text-black border border-[#DEE1E5] dark:border-none dark:bg-gray-100 mt-4 flex justify-center items-center p-2 rounded-r-2xl rounded-bl-2xl"
              }`}
            >
              <div className="group-hover:pr-2">
                {d.status === "deleted" ? (
                  <div>This Message was Deleted!</div>
                ) : (
                  <div className="rounded-2xl ">
                    <VideoPlayer
                      width={"100%"}
                      height={"h-full"}
                      src={d?.url}
                    />
                    {d?.text && <div>{d?.text}</div>}
                  </div>
                )}
              </div>

              {d?.status !== "deleted" && (
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={` relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} className="" />
                </div>
              )}

              <div
                className={`flex flex-col gap-1 absolute z-40 ${
                  data?.id === d?.sender?._id
                    ? "right-0"
                    : "left-0 bg-[#f3f3f3]"
                }   shadow-2xl  text-black  duration-100
              ${
                popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
              }
                ${
                  click === true
                    ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                    : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                } `}
              >
                <div
                  onClick={() => {
                    dispatch(setType("reply"));
                    dispatch(
                      setReplyFunction({
                        reply: "Video",
                        replyId: d?.mesId,
                      })
                    );
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={replypic}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Reply</div>
                </div>

                <div
                  onClick={() => {
                    deletepopUp(d?.mesId);
                    setClick(false);
                  }}
                  className={`duration-100 flex gap-2 items-center ${
                    click === true
                      ? "text-[14px] my-2 px-3 cursor-pointer"
                      : "text-[0px] my-0 px-0"
                  }`}
                >
                  <div>
                    <Image
                      src={deletechat}
                      className={`duration-75 ${
                        click === true ? "w-[19px] h-[17px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div>Delete</div>
                </div>

                {/* <div></div>
				<div></div> */}
              </div>
            </div>
          )}

          {d?.typ == "gif" && (
            <div
              onDoubleClick={() => {
                if (d?.status != "deleted") {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: "Gif", replyId: d?.mesId })
                  );
                }
              }}
            >
              <div
                className={`relative group  ${
                  data?.id === d?.sender?._id
                    ? "bg-[#5585FF] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] text-[#9B9C9E] font-medium border border-[#DEE1E5] dark:border-none dark:bg-[#1A1D21] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div>This Message was Deleted!</div>
                  ) : (
                    <div>
                      <img
                        src={d?.url}
                        alt="gif"
                        className="h-[145px] sm:w-[240px] sm:h-[240px] w-[145px] rounded-2xl  bg-yellow-300 "
                      />
                      {d?.text && <div>{d?.text}</div>}
                    </div>
                  )}
                </div>
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={` relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`flex flex-col gap-1 absolute z-40 ${
                      data?.id === d?.sender?._id
                        ? "right-0"
                        : "left-0 bg-[#f3f3f3]"
                    }   shadow-2xl  text-black  duration-100
                ${
                  popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                }
                  ${
                    click === true
                      ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                      : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                  } `}
                  >
                    <div
                      onClick={() => {
                        dispatch(setType("reply"));
                        dispatch(
                          setReplyFunction({
                            reply: "Gif",
                            replyId: d?.mesId,
                          })
                        );
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2 items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3 cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={replypic}
                          className={`duration-75 ${
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>

                    <div
                      onClick={() => {
                        deletepopUp(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2 items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3 cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={deletechat}
                          className={`duration-75 ${
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Delete</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {data?.id == d?.sender?._id && (
          <div className="flex flex-col items-center justify-center">
            {data?.id === d?.sender?._id && (
              <div className="h-[35px]  relative w-[35px]  overflow-hidden bg-[#fff] rounded-[14px]">
                <img src={data?.dp} className="w-full h-full" />
              </div>
            )}

            <div className="text-[14px] mt-1">{d?.timestamp}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityChat;
