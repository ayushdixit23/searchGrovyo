import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { API } from "../../Essentials";
import {
  setHiddenMsgs,
  setMessages,
  setReplyFunction,
  setType,
} from "../redux/slice/messageSlice";
import { useSelector } from "react-redux";
import { IoDocumentSharp } from "react-icons/io5";
import VideoPlayer from "./VideoPlayer";
import hidden from "../assets/hidechat.png";
import deletechat from "../assets/deletechat.png";
import replypic from "../assets/replypic.png";
import Image from "next/image";

const PrivateChats = React.forwardRef(
  (
    {
      d,
      messages,
      handleScrollToMessage,
      receiverId,
      convId,
      socket,
      showHiddenreply = true,
      data,
      dispatch,
      i,
      user,
    },
    ref
  ) => {
    const [click, setClick] = useState(false);
    const [delopen, setDelopen] = useState(false);
    const [msgId, setMsgId] = useState(null);
    const hiddenMsg = useSelector((state) => state.message.hiddenMsg);

    function getHourAndMinutes(dateString) {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    const hideChats = async (msgid) => {
      try {
        const hidden = [data?.id];
        const updatedMessages = messages.filter((f) => f?.mesId !== msgid);
        const messageObj = messages.find((f) => f?.mesId === msgid);
        const updatedMessageObj = messageObj ? { ...messageObj, hidden } : null;
        dispatch(setMessages(updatedMessages));
        const updatedHiddenMsgs = updatedMessageObj
          ? [...hiddenMsg, updatedMessageObj]
          : hiddenMsg;
        dispatch(setHiddenMsgs(updatedHiddenMsgs));
        await axios.post(`${API}/hideconvmsg/${data?.id}`, { msgid });
      } catch (error) {
        console.log(error);
      }
    };

    const handleDelete = async (action) => {
      try {
        if (action === "everyone") {
          socket.emit("deleteforeveryone", {
            roomId: convId,
            rec: receiverId,
            userId: data?.id,
            data: msgId,
          });
          const updatedMessages = messages.map((f, h) => {
            if (f?.mesId === msgId) {
              return { ...f, status: "deleted" };
            } else {
              return f;
            }
          });
          dispatch(setMessages(updatedMessages));
        } else {
          const updatedMessages = messages.filter((f) => f?.mesId !== msgId);
          dispatch(setMessages(updatedMessages));
        }
        setDelopen(false);
        const res = await axios.post(`${API}/deletemessages/${data?.id}`, {
          convId: convId,
          msgIds: msgId,
          action,
        });
      } catch (e) {
        console.log(e);
      }
    };

    // Words limit
    const limitWords = (text, wordLimit) => {
      // const words = text.split(" ");
      return text.length > wordLimit ? text.slice(0, wordLimit) + ".." : text;
    };

    const deletepopUp = (mesId) => {
      try {
        setMsgId(Number(mesId));
        setDelopen(true);
      } catch (error) {
        console.log(error);
      }
    };

    const UnhideChats = async (msgid) => {
      try {
        const res = await axios.post(`${API}/unhideconvmsg/${data?.id}`, {
          msgid,
        });
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

    useEffect(() => {
      if (!click) {
        setPopupPosition("bottom"); // Reset popup position when click is false
      }
    }, [click]);

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
          className={`fixed inset-0 duration-100 ${
            click ? " w-full h-screen  z-40" : "z-0 w-0 h-0"
          }`}
        ></div>

        <div
          key={i}
          ref={ref}
          className={`flex gap-2 my-2 ${
            data?.id === d?.sender?._id ? "justify-end" : "justify-start"
          }  w-full items-start`}
        >
          {data?.id !== d?.sender?._id && (
            <div className="flex flex-col items-center justify-center">
              {data?.id !== d?.sender?._id && (
                <div className="h-[40px] w-[40px] overflow-hidden bg-[#fff] rounded-2xl">
                  <img
                    src={user?.profilepic}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-[14px] mt-1">{d?.timestamp}</div>
            </div>
          )}
          <div className="flex items-centers ">
            {d?.typ === "message" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group h-auto flex justify-start items-center mt-6 ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 px-4 md:text-[14px]  rounded-l-2xl pn:max-sm:text-[14px] max-w-[650px]  rounded-br-2xl "
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 px-4 rounded-r-2xl md:text-[14px] pn:max-sm:text-[14px] max-w-[650px] rounded-bl-2xl"
                } `}
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <div className="">
                  {d.status === "deleted" ? (
                    <div className="italic text-[14px] font-semibold px-2">
                      This Message was Deleted!
                    </div>
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
                                    part.endsWith(".pdf") ||
                                    part.endsWith(".zip")
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
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
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
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>
                  )}

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

                  {/* <div></div>
				<div></div> */}
                </div>
              </div>
            )}

            {d?.typ === "reply" && (
              <div
                onClick={() => handleScrollToMessage(d?.mesId)}
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group h-auto  flex justify-center items-center mt-6 ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff]  text-white  rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
                }`}
              >
                <div className="p-2">
                  {d.status === "deleted" ? (
                    <div>This Message was Deleted!</div>
                  ) : (
                    <>
                      {d?.text?.match(/https:\/\/[^\s]+/g) ? (
                        d?.text
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
                              <div key={index}>
                                <div className="bg-slate-400 p-1 rounded-lg">
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
                                : "bg-[#f9fafb] dark:bg-[#1A1D21] text-[#9B9C9E] border-l-4 border-[#0075ff] "
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
                  className={`flex flex-col gap-1 ${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
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
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>
                  )}

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

                  {/* <div></div>
				<div></div> */}
                </div>
              </div>
            )}

            {d?.typ == "image" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative max-w-[350px] h-[350px] w-full group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 rounded-l-2xl mt-4 rounded-br-2xl "
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
                }`}
              >
                <div
                  className="w-full h-full"
                  // className={`${
                  //   data?.id === d?.sender?._id
                  //     ? "group-hover:pr-2"
                  //     : "group-hover:pl-2"
                  // }`}
                >
                  {d.status === "deleted" ? (
                    <div>This Message was Deleted!</div>
                  ) : (
                    <div className="w-full h-full">
                      <img
                        src={d?.url}
                        className="w-full h-full rounded-2xl object-cover bg-white "
                      />
                      {d?.text && (
                        <div
                          className={`${
                            data?.id === d?.sender?._id
                              ? "text-white"
                              : "text-black"
                          } md:text-[14px]  py-1 pn:max-sm:text-[14px] `}
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
                  className={`flex flex-col gap-1 ${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-md dark:shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
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
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>
                  )}

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

                  {/* <div></div>
				<div></div> */}
                </div>
              </div>
            )}

            {d?.typ == "doc" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: "Document", replyId: d?.mesId })
                  );
                }}
                className={` relative group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 rounded-l-2xl mt-4 rounded-br-2xl "
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
                }`}
              >
                <div>
                  {d.status === "deleted" ? (
                    <div>This Message was Deleted!</div>
                  ) : (
                    <a
                      href={d.url}
                      download={d.content.name}
                      className=" flex justify-center bg-white p-3 rounded-xl text-black items-center gap-1 "
                    >
                      <div>
                        <IoDocumentSharp className="text-2xl" />
                      </div>
                      <div className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer font-semibold">
                        {d?.content?.name}
                      </div>
                    </a>
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
                  className={` flex flex-col gap-1 ${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
                    <div
                      onClick={() => {
                        dispatch(setType("reply"));
                        dispatch(
                          setReplyFunction({
                            reply: "Document",
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
                  )}

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
              </div>
            )}

            {d?.typ == "video" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: "Video", replyId: d?.mesId })
                  );
                }}
                className={`relative max-w-[350px] max-h-[350px] group ${
                  data?.id === d?.sender?._id
                    ? " bg-[#0075ff] text-white mt-4 flex justify-center items-center p-2 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] mt-4 flex justify-center items-center p-2 rounded-r-2xl rounded-bl-2xl"
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
                  className={`flex flex-col gap-1 ${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
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
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>
                  )}

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
              </div>
            )}

            {d?.typ == "glimpse" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group  ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div>This Message was Deleted!</div>
                  ) : (
                    <video
                      src={d?.url}
                      className="h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-white "
                      controls
                    />
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
                  className={`flex flex-col gap-1 ${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => {
                        UnhideChats(d?.mesId);
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
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Unhide</div>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        hideChats(d?.mesId);
                        setClick(false);
                      }}
                      className={`duration-100 flex gap-2  items-center ${
                        click === true
                          ? "text-[14px] my-2 px-3  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      <div>
                        <Image
                          src={hidden}
                          className={`duration-75 ${
                            click === true
                              ? "w-[22px] h-[20px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Hide</div>
                    </div>
                  )}

                  {showHiddenreply && (
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
                            click === true
                              ? "w-[19px] h-[17px]"
                              : "h-[0px] w-[0px]"
                          }`}
                        />
                      </div>
                      <div>Reply</div>
                    </div>
                  )}

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

                  {/* <div></div>
				<div></div> */}
                </div>
              </div>
            )}

            {d?.typ == "post" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group sm:w-[350px] sm:h-[350px] ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="">
                  <div className="group-hover:pr-2">
                    {d.status === "deleted" ? (
                      <div>This Message was Deleted!</div>
                    ) : (
                      <div className="max-w-full h-[260px]">
                        {d?.content.type.startsWith("image") ? (
                          <div className="w-full h-full">
                            <img
                              className={`w-full h-full ${
                                data?.id === d?.sender?._id
                                  ? " rounded-2xl bg-yellow-300 "
                                  : " rounded-2xl bg-yellow-300"
                              }`}
                              src={d?.url}
                              alt=""
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full">
                            <video
                              src={d?.url}
                              className={`w-full h-full ${
                                data?.id === d?.sender?._id
                                  ? " rounded-2xl bg-yellow-300 "
                                  : " rounded-2xl bg-yellow-300"
                              }`}
                              controls
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

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

                  <div
                    className={`flex flex-col gap-1 ${
                      popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                    } absolute z-40 ${
                      data?.id === d?.sender?._id
                        ? "right-0"
                        : "left-0 bg-[#f3f3f3]"
                    }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                          : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                  >
                    {d?.hidden?.includes(data?.id) ? (
                      <div
                        onClick={() => {
                          UnhideChats(d?.mesId);
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
                            src={hidden}
                            className={`duration-75 ${
                              click === true
                                ? "w-[22px] h-[20px]"
                                : "h-[0px] w-[0px]"
                            }`}
                          />
                        </div>
                        <div>Unhide</div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          hideChats(d?.mesId);
                          setClick(false);
                        }}
                        className={`duration-100 flex gap-2  items-center ${
                          click === true
                            ? "text-[14px] my-2 px-3  cursor-pointer"
                            : "text-[0px] my-0 px-0"
                        }`}
                      >
                        <div>
                          <Image
                            src={hidden}
                            className={`duration-75 ${
                              click === true
                                ? "w-[22px] h-[20px]"
                                : "h-[0px] w-[0px]"
                            }`}
                          />
                        </div>
                        <div>Hide</div>
                      </div>
                    )}

                    {showHiddenreply && (
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
                              click === true
                                ? "w-[19px] h-[17px]"
                                : "h-[0px] w-[0px]"
                            }`}
                          />
                        </div>
                        <div>Reply</div>
                      </div>
                    )}

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

                    {/* <div></div>
				<div></div> */}
                  </div>
                </div>
                <div className="h-[45px] sm:h-[40px]  rounded-2xl ">
                  {d?.text.length > 20 ? `${d?.text.slice(0, 20)}...` : d?.text}
                </div>
                <div className="text-[14px] -mt-1 flex justify-center items-center h-[40px] bg-[#f7f7f7] rounded-xl">
                  Visit
                </div>
              </div>
            )}

            {d?.typ == "product" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div>
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
                      <div>
                        {d?.content.type.startsWith("image") ? (
                          <img
                            src={d?.url}
                            alt=""
                            className="h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
                          />
                        ) : (
                          <video
                            src={d?.url}
                            controls
                            className="h-[145px] w-[145px] sm:h-[240px] sm:w-[240px] rounded-2xl bg-yellow-300 "
                          />
                        )}
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
                      className={`flex flex-col gap-1 ${
                        popupPosition === "top" ? "bottom-20" : "top-4" // Dynamically set position based on popupPosition state
                      } absolute z-40 ${
                        data?.id === d?.sender?._id
                          ? "right-0 bg-white"
                          : "left-0 bg-[#f3f3f3]"
                      }   shadow-2xl  text-black  
                     rounded-lg py-2 w-[80px] h-[110px]  `}
                    >
                      {d?.hidden?.includes(data?.id) ? (
                        <div
                          onClick={() => {
                            UnhideChats(d?.mesId);
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
                              src={hidden}
                              className={`duration-75 ${
                                click === true
                                  ? "w-[22px] h-[20px]"
                                  : "h-[0px] w-[0px]"
                              }`}
                            />
                          </div>
                          <div>Unhide</div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            hideChats(d?.mesId);
                            setClick(false);
                          }}
                          className={`duration-100 flex gap-2  items-center ${
                            click === true
                              ? "text-[14px] my-2 px-3  cursor-pointer"
                              : "text-[0px] my-0 px-0"
                          }`}
                        >
                          <div>
                            <Image
                              src={hidden}
                              className={`duration-75 ${
                                click === true
                                  ? "w-[22px] h-[20px]"
                                  : "h-[0px] w-[0px]"
                              }`}
                            />
                          </div>
                          <div>Hide</div>
                        </div>
                      )}

                      {showHiddenreply && (
                        <div
                          onClick={() => {
                            dispatch(setType("reply"));
                            dispatch(
                              setReplyFunction({
                                reply: "Product",
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
                      )}

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
                <div className="w-[145px] sm:w-[240px] overflow-hidden text-[14px] h-[80px]">
                  {d?.text}
                </div>
                <div className="text-[14px] sm:w-[240px] flex justify-center items-center w-[145px] h-[40px] bg-white rounded-xl">
                  View Product
                </div>
              </div>
            )}

            {d?.typ == "gif" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
              >
                <div
                  className={`relative group  ${
                    data?.id === d?.sender?._id
                      ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                      : "bg-[#ffffff] dark:bg-[#0D0D0D] border dark:border-[#1A1D21] text-[#9B9C9E] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
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
                      className={`flex flex-col gap-1
                         ${
                           click === true
                             ? "rounded-[15px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-custom-lg py-2 w-auto h-auto min-w-[150px]"
                             : "rounded-[0px] bg-white dark:text-white dark:bg-[#0D0F10] text-[#6e6e6e] shadow-0 py-0 w-[0px] h-[0px]"
                         }

                        ${
                          popupPosition === "top" ? "bottom-20" : "top-4"
                        } absolute z-40 ${
                        data?.id === d?.sender?._id
                          ? "right-0 bg-white"
                          : "left-0 bg-[#f3f3f3]"
                      }  `}
                    >
                      {d?.hidden?.includes(data?.id) ? (
                        <div
                          onClick={() => {
                            UnhideChats(d?.mesId);
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
                              src={hidden}
                              className={`duration-75 ${
                                click === true
                                  ? "w-[22px] h-[20px]"
                                  : "h-[0px] w-[0px]"
                              }`}
                            />
                          </div>
                          <div>Unhide</div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            hideChats(d?.mesId);
                            setClick(false);
                          }}
                          className={`duration-100 flex gap-2  items-center ${
                            click === true
                              ? "text-[14px] my-2 px-3  cursor-pointer"
                              : "text-[0px] my-0 px-0"
                          }`}
                        >
                          <div>
                            <Image
                              src={hidden}
                              className={`duration-75 ${
                                click === true
                                  ? "w-[22px] h-[20px]"
                                  : "h-[0px] w-[0px]"
                              }`}
                            />
                          </div>
                          <div>Hide</div>
                        </div>
                      )}

                      {showHiddenreply && (
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
                      )}

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

          {data?.id === d?.sender?._id && (
            <div className="flex flex-col items-center justify-center">
              {data?.id === d?.sender?._id && (
                <div className="h-[40px]  relative w-[40px]  overflow-hidden bg-[#fff] rounded-[14px]">
                  <div
                    className={`${
                      d?.readby?.includes(receiverId)
                        ? "hidden"
                        : "absolute top-0 left-0 bg-black/40 w-full h-full"
                    } `}
                  ></div>
                  <img src={data?.dp} className="w-full h-full object-cover" />
                </div>
              )}
              {console.log(d?.timestamp, "d?.timestamp")}
              {d?.typ === "post" && (
                <div className="text-[14px] mt-1">
                  {getHourAndMinutes(d?.timestamp)}
                </div>
              )}
              {d?.typ !== "post" && (
                <div className="text-[14px] mt-1">{d?.timestamp}</div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
);

export default PrivateChats;
