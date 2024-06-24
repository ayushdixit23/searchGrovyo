// import { MediaPlayer, MediaProvider } from '@vidstack/react'
// import {
// 	defaultLayoutIcons,
// 	DefaultVideoLayout,
// } from "@vidstack/react/player/layouts/default";

import React, { useEffect, useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { API } from "../../Essentials";
import { socketemitfunc } from "../utils/SocketWrapper";
import {
  setHiddenMsgs,
  setMessages,
  setReplyFunction,
  setType,
} from "../redux/slice/messageSlice";
import { useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";

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
          <div className="fixed inset-0 z-40 flex justify-center items-center w-screen h-screen">
            <div className="flex justify-center flex-col items-center h-full w-[40%]">
              <div className="text-xl">Delete Message</div>
              <div>
                {data?.id === d?.sender?._id && (
                  <div
                    onClick={() => handleDelete("everyone")}
                    className="p-2 px-5 rounded-xl bg-black text-white"
                  >
                    Delete for Everyone
                  </div>
                )}
                <div
                  onClick={() => handleDelete("me")}
                  className="p-2 px-5 rounded-xl bg-black text-white"
                >
                  Delete for me
                </div>
                <div
                  onClick={() => {
                    setDelopen(false);
                    setMsgId("");
                  }}
                  className="p-2 px-5 rounded-xl bg-black text-white"
                >
                  Cancel
                </div>
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
                  <img src={user?.profilepic} className="w-full h-full" />
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
                    ? "bg-[#0075ff]  text-white p-2 px-4 md:text-[14px]  rounded-l-2xl pn:max-sm:text-[14px] max-w-[650px]  rounded-br-2xl "
                    : "bg-[#ffffff]  dark:text-black dark:bg-gray-100 p-2 px-4 rounded-r-2xl md:text-[14px] pn:max-sm:text-[14px] max-w-[650px] rounded-bl-2xl"
                } `}
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <div className="">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
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

                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} className=""/>
                </div>

                <div
                  className={`${
                    popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
                  } absolute z-40 ${
                    data?.id === d?.sender?._id
                      ? "right-0"
                      : "left-0 bg-[#f3f3f3]"
                  }   shadow-2xl  text-black  duration-100
                      ${
                        click === true
                          ? "rounded-[15px] bg-white shadow-2xl  py-2 w-[80px] h-[110px]"
                          : "rounded-[0px] bg-white shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
                >
                  {d?.hidden?.includes(data?.id) ? (
                    <div
                      onClick={() => UnhideChats(d?.mesId)}
                      className={`duration-100 ${
                        click === true
                          ? "text-[14px] my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      Unhide
                    </div>
                  ) : (
                    <div
                      onClick={() => hideChats(d?.mesId)}
                      className={`duration-100 ${
                        click === true
                          ? "text-[14px] my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      Hide
                    </div>
                  )}
                  <div
                    onClick={() => deletepopUp(d?.mesId)}
                    className={`duration-100 ${
                      click === true
                        ? "text-[14px] my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        : "text-[0px] my-0 px-0"
                    }`}
                  >
                    Delete
                  </div>
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
                      }}
                      className={`duration-100 ${
                        click === true
                          ? "text-[14px] my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                          : "text-[0px] my-0 px-0"
                      }`}
                    >
                      Reply
                    </div>
                  )}

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
                    ? "bg-[#0075ff]  text-white p-2  rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
                }`}
              >
                <div className="p-2">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
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
                                : "bg-[#f9fafb] text-black border-l-4 border-[#0075ff] "
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
                            className="md:text-[14px] pn:max-sm:text-[14px] px-2 "
                          >
                            {d?.text}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`${
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
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f1f1f1] cursor-pointer"
                      >
                        Unhide
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3] cursor-pointer"
                      >
                        Hide
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm my-2 px-3 hover:bg-[#f3f3f3] cursor-pointer"
                    >
                      Delete
                    </div>
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
                        }}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3] cursor-pointer"
                      >
                        Reply
                      </div>
                    )}
                  </div>
                )}
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
                className={`relative max-w-[240px] group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2  rounded-l-2xl mt-4 rounded-br-2xl "
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
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
                    <div className="italic">This Message was Deleted!</div>
                  ) : (
                    <div className="">
                      <img
                        src={d?.url}
                        className="h-[145px]  sm:w-[240px] sm:h-[240px] w-[145px] rounded-2xl  bg-white "
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
                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`${
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
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Unhide
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Hide
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                    >
                      Delete
                    </div>
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
                        }}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Reply
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {d?.typ == "doc" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 rounded-l-2xl mt-4 rounded-br-2xl "
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
                }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
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

                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`${
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
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Unhide
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Hide
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                    >
                      Delete
                    </div>
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
                        }}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Reply
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {d?.typ == "video" && (
              <div
                onDoubleClick={() => {
                  dispatch(setType("reply"));
                  dispatch(
                    setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                  );
                }}
                className={`relative group ${
                  data?.id === d?.sender?._id
                    ? " bg-[#0075ff] text-white h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
                  ) : (
                    <div>
                      <video
                        src={d?.url}
                        className="h-[145px] w-[145px] rounded-2xl bg-yellow-300"
                        controls
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
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`${
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
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Unhide
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Hide
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                    >
                      Delete
                    </div>
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
                        }}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Reply
                      </div>
                    )}
                  </div>
                )}
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
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
                  ) : (
                    <video
                      src={d?.url}
                      className="h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-white "
                      controls
                    />
                  )}
                </div>

                <div
                  onClick={() => {
                    setClick(true);
                    handleIconClick();
                  }}
                  ref={iconRef}
                  className={`${
                    data?.id === d?.sender?._id ? "right-0" : "left-0"
                  } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                >
                  <BsThreeDotsVertical size={16} />
                </div>
                {click && (
                  <div
                    className={`${
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
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Unhide
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Hide
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                    >
                      Delete
                    </div>
                    {showHiddenreply && (
                      <div
                        onClick={() => {
                          dispatch(setType("reply"));
                          dispatch(
                            setReplyFunction({
                              reply: "Glimpse",
                              replyId: d?.mesId,
                            })
                          );
                        }}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Reply
                      </div>
                    )}

                    {/* <div></div>
				<div></div> */}
                  </div>
                )}
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
                className={`relative group ${
                  data?.id === d?.sender?._id
                    ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <div className="">
                  <div className="group-hover:pr-2">
                    {d.status === "deleted" ? (
                      <div className="italic">This Message was Deleted!</div>
                    ) : (
                      <div>
                        {d?.content.type.startsWith("image") ? (
                          <img
                            className={`${
                              data?.id === d?.sender?._id
                                ? "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
                                : "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300"
                            }`}
                            src={d?.url}
                            alt=""
                          />
                        ) : (
                          <video
                            src={d?.url}
                            className={`${
                              data?.id === d?.sender?._id
                                ? "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300 "
                                : "h-[145px] sm:h-[240px] sm:w-[240px] w-[145px] rounded-2xl bg-yellow-300"
                            }`}
                            controls
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
                    className={`${
                      data?.id === d?.sender?._id ? "right-0" : "left-0"
                    } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                  >
                    <BsThreeDotsVertical size={16} />
                  </div>
                  {click && (
                    <div
                      className={`${
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
                          onClick={() => UnhideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Unhide
                        </div>
                      ) : (
                        <div
                          onClick={() => hideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Hide
                        </div>
                      )}
                      <div
                        onClick={() => deletepopUp(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Delete
                      </div>
                      {showHiddenreply && (
                        <div
                          onClick={() => {
                            dispatch(setType("reply"));
                            dispatch(
                              setReplyFunction({
                                reply: "Post",
                                replyId: d?.mesId,
                              })
                            );
                          }}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Reply
                        </div>
                      )}

                      {/* <div></div>
				<div></div> */}
                    </div>
                  )}
                </div>
                <div className="h-[45px] sm:h-[40px] sm:w-[240px] w-[145px] rounded-2xl ">
                  {d?.text}
                </div>
                <div className="text-[14px] sm:w-[240px] flex justify-center items-center w-[145px] h-[40px] bg-[#f7f7f7] rounded-xl">
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
                    : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
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
                      <div className="italic">This Message was Deleted!</div>
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
                    className={`${
                      data?.id === d?.sender?._id ? "right-0" : "left-0"
                    } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                  >
                    <BsThreeDotsVertical size={16} />
                  </div>
                  {click && (
                    <div
                      className={`${
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
                          onClick={() => UnhideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Unhide
                        </div>
                      ) : (
                        <div
                          onClick={() => hideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Hide
                        </div>
                      )}
                      <div
                        onClick={() => deletepopUp(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Delete
                      </div>
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
                          }}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Reply
                        </div>
                      )}
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
                      : "bg-[#ffffff] dark:text-black dark:bg-gray-100 p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                  }`}
                >
                  <div className="group-hover:pr-2">
                    {d.status === "deleted" ? (
                      <div className="italic">This Message was Deleted!</div>
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
                    className={`${
                      data?.id === d?.sender?._id ? "right-0" : "left-0"
                    } relative group-hover:absolute hidden bg-transparent group-hover:block   top-2 right-0`}
                  >
                    <BsThreeDotsVertical size={16} />
                  </div>
                  {click && (
                    <div
                      className={`${
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
                          onClick={() => UnhideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Unhide
                        </div>
                      ) : (
                        <div
                          onClick={() => hideChats(d?.mesId)}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Hide
                        </div>
                      )}
                      <div
                        onClick={() => deletepopUp(d?.mesId)}
                        className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                      >
                        Delete
                      </div>

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
                          }}
                          className="text-sm my-2 px-3 hover:bg-[#f3f3f3]  cursor-pointer"
                        >
                          Reply
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {data?.id === d?.sender?._id && (
            <div className="flex flex-col items-center justify-center">
              {data?.id === d?.sender?._id && (
                <div className="h-[35px]  relative w-[35px]  overflow-hidden bg-[#fff] rounded-[14px]">
                  <div
                    className={`${
                      d?.readby.includes(receiverId)
                        ? "hidden"
                        : "absolute top-0 left-0 bg-black/40 w-full h-full"
                    } `}
                  ></div>
                  <img src={data?.dp} className="w-full h-full" />
                </div>
              )}

              <div className="text-[14px] mt-1">{d?.timestamp}</div>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default PrivateChats;
