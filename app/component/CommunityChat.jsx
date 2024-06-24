import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  setReplyFunction,
  setType,
  setMessages,
} from "../redux/slice/comChatSlice";
import axios from "axios";
import { API } from "@/Essentials";
import VideoPlayer from "./VideoPlayer";
import { socketemitfunc } from "../utils/SocketWrapper";

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
        <div className="fixed inset-0 z-40 flex justify-center items-center w-screen h-screen">
          <div className="flex justify-center flex-col items-center h-full w-[40%]">
            <div className="text-xl">Delete Message</div>
            <div>
              {data?.id === d?.sender?._id && (
                <div
                  onClick={() => handleDelete("everyone")}
                  className="p-2 px-5 rounded-xl bg-red-300 text-white"
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
        className={`fixed inset-0 w-screen h-screen ${click ? "z-40" : "-z-20"
          }`}
      ></div>

      <div
        key={i}
        className={`flex px-2 ${data?.id === d?.sender?._id ? "justify-end" : "justify-start"
          }  w-full items-center relative`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <div className="flex py-1  ">
              {data?.id !== d?.sender?._id && <div className="flex flex-col items-center justify-center">
                {data?.id !== d?.sender?._id && <div className="h-[40px] w-[40px] overflow-hidden bg-[#fff] rounded-2xl">
                  <img src={d?.dp} className="w-full h-full" />
                </div>}

                <div className="text-[14px] mt-1">{d?.timestamp}</div>
              </div>}
              <div>
                <div className="text-[14px] font-medium items-end flex">
                  {d?.sender?.fullname}
                </div>
                {d?.typ === "message" && (
                  <div
                    onDoubleClick={() => {
                      dispatch(setType("reply"));
                      dispatch(
                        setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                      );
                    }}
                    className={`relative group h-auto flex justify-center w-auto items-center ${data?.id === d?.sender?._id
                      ? "bg-[#0075ff] text-white p-2 rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
                      : "bg-[#ffffff]  p-2 rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
                      }`}
                  >
                    <div className="group-hover:pr-2">
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
                      onClick={() => setClick(true)}
                      className={`absolute bg-transparent  z-10 group-hover:block bg-sky-950 top-3 right-0} `}
                    >
                      <HiOutlineDotsVertical className="text-black" />
                    </div>
                    {click && (
                      <div
                        className={` absolute z-40 bg-blue-300 text-white top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto`}
                      >
                        <div
                          onClick={() => deletepopUp(d?.mesId)}
                          className="text-sm"
                        >
                          Delete msg
                        </div>
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
                          className="text-sm"
                        >
                          Reply msg
                        </div>
                      </div>
                    )}
                  </div>
                )}</div>
            </div>
            {data?.id === d?.sender?._id && <div className="flex flex-col items-center justify-center">

              {data?.id === d?.sender?._id && <div className="h-[35px]  relative w-[35px]  overflow-hidden bg-[#fff] rounded-[14px]">
                <div className="absolute top-0 left-0 bg-black/40 w-full h-full"></div>
                <img src={d?.dp} className="w-full h-full" />
              </div>}

              <div className="text-[14px] mt-1">{d?.timestamp}</div>
            </div>}
          </div>

          {d?.typ === "reply" && (
            <div
              onDoubleClick={() => {
                dispatch(setType("reply"));
                dispatch(
                  setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                );
              }}
              className={`relative group h-auto  flex justify-center items-center mt-6 ${data?.id === d?.sender?._id
                ? "bg-[#0075ff] text-white p-2  rounded-l-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-br-2xl "
                : "bg-[#ffffff] p-2 rounded-r-2xl pn:max-sm:text-[14px] max-w-[320px] rounded-bl-2xl"
                }`}
            >
              <div className="group-hover:pr-2">
                {d.status === "deleted" ? (
                  <div className="italic">This Message was Deleted!</div>
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
                            style={{ textDecoration: "none", color: "inherit" }}
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
                            <div className="bg-slate-400 p-1 rounded-lg">
                              {d?.reply}
                            </div>
                            <div>{part}</div>
                          </div>
                        )
                      )
                    ) : (
                      <div>
                        <div className="bg-slate-400 p-1 rounded-lg">
                          {d?.reply}
                        </div>
                        <div>{d?.text}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div
                onClick={() => setClick(true)}
                className={` absolute hidden bg-transparent group-hover:block bg-sky-950 top-3 right-0`}
              >
                <HiOutlineDotsVertical />
              </div>
              {click && (
                <div
                  className={` absolute z-40 bg-black text-white top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto`}
                >
                  <div
                    onClick={() => deletepopUp(d?.mesId)}
                    className="text-sm"
                  >
                    Delete msg
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setType("reply"));
                      dispatch(
                        setReplyFunction({ reply: d?.text, replyId: d?.mesId })
                      );
                    }}
                    className="text-sm"
                  >
                    Reply msg
                  </div>
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
              className={`relative group ${data?.id === d?.sender?._id
                ? "bg-[#0075ff] text-white p-2 rounded-l-2xl mt-4 rounded-br-2xl "
                : "bg-[#ffffff] p-2 rounded-r-2xl mt-4 rounded-bl-2xl"
                }`}
            >
              <div className="group-hover:pr-2">
                {d.status === "deleted" ? (
                  <div className="italic">This Message was Deleted!</div>
                ) : (
                  <div>
                    <img
                      src={d?.url}
                      className="h-[145px] sm:w-[240px] sm:h-[240px] w-[145px] rounded-2xl  bg-yellow-300 "
                    />
                    {d?.text && <div>{d?.text}</div>}
                  </div>
                )}
              </div>
              <div
                onClick={() => setClick(true)}
                className={` absolute  hidden bg-transparent group-hover:block bg-sky-950 top-3 right-0`}
              >
                <HiOutlineDotsVertical />
              </div>
              {click && (
                <div
                  className={` absolute z-40 bg-black text-white top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto`}
                >
                  <div
                    onClick={() => deletepopUp(d?.mesId)}
                    className="text-sm"
                  >
                    Delete msg
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setType("reply"));
                      dispatch(
                        setReplyFunction({ reply: "Image", replyId: d?.mesId })
                      );
                    }}
                    className="text-sm"
                  >
                    Reply msg
                  </div>
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
              className={`relative group ${data?.id === d?.sender?._id
                ? " bg-[#0075ff] text-white h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-l-2xl rounded-br-2xl"
                : "bg-[#ffffff] h-[145px] sm:w-[240px] mt-4 sm:h-[240px] w-[145px] flex justify-center items-center p-2 rounded-r-2xl rounded-bl-2xl"
                }`}
            >
              <div className="group-hover:pr-2">
                {d.status === "deleted" ? (
                  <div className="italic">This Message was Deleted!</div>
                ) : (
                  <div>
                    <VideoPlayer
                      src={d?.url}
                      width={"100%"}
                      height={"h-full"}
                    />
                    {d?.text && <div>{d?.text}</div>}
                  </div>
                )}
              </div>

              <div
                onClick={() => setClick(true)}
                className={` absolute  hidden bg-transparent group-hover:block bg-sky-950 top-3 right-0`}
              >
                <HiOutlineDotsVertical />
              </div>
              {click && (
                <div
                  className={` absolute z-40 bg-black text-white top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto`}
                >
                  <div
                    onClick={() => deletepopUp(d?.mesId)}
                    className="text-sm"
                  >
                    Delete msg
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setType("reply"));
                      dispatch(
                        setReplyFunction({ reply: "Video", replyId: d?.mesId })
                      );
                    }}
                    className="text-sm"
                  >
                    Reply msg
                  </div>
                </div>
              )}
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
                className={`relative group  ${data?.id === d?.sender?._id
                  ? "bg-[#0075ff] text-white p-2 mt-4 rounded-l-2xl rounded-br-2xl"
                  : "bg-[#ffffff] p-2 mt-4 rounded-r-2xl rounded-bl-2xl"
                  }`}
              >
                <div className="group-hover:pr-2">
                  {d.status === "deleted" ? (
                    <div className="italic">This Message was Deleted!</div>
                  ) : (
                    <img
                      className="h-full w-full object-contain"
                      src={d?.url}
                      alt="gif"
                    />
                  )}
                </div>
                <div
                  onClick={() => setClick(true)}
                  className={` absolute  hidden bg-transparent group-hover:block bg-sky-950 top-3 right-0`}
                >
                  <HiOutlineDotsVertical />
                </div>
                {click && (
                  <div
                    className={` absolute z-40 bg-black text-white top-8 rounded-md p-3 -left-[40px] w-[100px] h-auto`}
                  >
                    {d?.hidden?.includes(data?.id) ? (
                      <div
                        onClick={() => UnhideChats(d?.mesId)}
                        className="text-sm"
                      >
                        Un Hide msg
                      </div>
                    ) : (
                      <div
                        onClick={() => hideChats(d?.mesId)}
                        className="text-sm"
                      >
                        Hide msg
                      </div>
                    )}
                    <div
                      onClick={() => deletepopUp(d?.mesId)}
                      className="text-sm"
                    >
                      Delete msg
                    </div>

                    <div
                      onClick={() => {
                        dispatch(setType("reply"));
                        dispatch(
                          setReplyFunction({ reply: "Gif", replyId: d?.mesId })
                        );
                      }}
                      className="text-sm"
                    >
                      Reply msg
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommunityChat;
