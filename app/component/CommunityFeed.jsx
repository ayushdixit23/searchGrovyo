"use client";

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import {
  setContent,
  setMessage,
  setMessages,
  setReplyFunction,
  setType,
  setincommsgs,
} from "@/app/redux/slice/comChatSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import VideoPlayer from "@/app/component/VideoPlayer";
import CommunityChat from "@/app/component/CommunityChat";
import { RxCross2 } from "react-icons/rx";
import { IoReorderThreeOutline } from "react-icons/io5";
import Members from "@/app/component/Members";
import Link from "next/link";
import CommunityPost from "@/app/component/CommunityPost";
import { useAuthContext } from "../utils/AuthWrapper";
import { useSocketContext, socketemitfunc } from "../utils/SocketWrapper";
import { API } from "@/Essentials";
import Input from "./Input";
import Loader from "./Loader";

function CommunityFeed({ id }) {
  const { data } = useAuthContext();
  const { socket } = useSocketContext();
  const [com, setCom] = useState([]);
  const [dp, setDp] = useState("");
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([]);
  const [tId, setTId] = useState("");
  // const [messages, setMessages] = useState([]);
  const [shareValue, setShareValue] = useState("");
  const [share, setShare] = useState(false);
  const [currentState, setCurrentState] = useState("post");
  const [memcount, setMemcount] = useState(0);
  const [isTopicJoined, setIsTopicJoined] = useState(false);
  const [topicData, setTopicData] = useState("");
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const messages = useSelector((state) => state.comChat.messages);
  const [options, setOptions] = useState(false);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const optionType = searchParams.get("type");
  const type = useSelector((state) => state.comChat.type);
  const name = useSelector((state) => state.comChat.name);
  const content = useSelector((state) => state.comChat.content);
  const size = useSelector((state) => state.comChat.size);
  const [load, setLoad] = useState(true);
  const msgs = useSelector((state) => state.comChat.message);
  const [reports, setReports] = useState([]);
  const [comtype, setComtype] = useState("");
  const reply = useSelector((state) => state.comChat.reply);
  const replyId = useSelector((state) => state.comChat.replyId);
  const [isjoined, setIsjoined] = useState(false);
  const [creatorId, setCreatorId] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const fetchCommunity = async () => {
    try {
      setLoad(true);
      const res = await axios.get(`${API}/compostfeed/${data?.id}/${id}`);
      setMemcount(res?.data?.community?.memberscount);
      setTitle(res.data.community.title);
      setTopics(res.data.community.topics);
      setDp(res.data?.dp);
      setComtype(res.data?.community?.type);
      setCreatorId(res.data?.community?.creator._id);
      setLoad(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false);
    }
  };

  const handleReport = async () => {
    try {
      if (reports?.length > 0) {
        await axios.post(`${API}/web/reporting/${data?.id}`, {
          data: reports,
          id: id,
          type: "Community",
        });
      } else {
        console.log("Something went wrong...");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const unjoinmembers = async () => {
    try {
      setIsjoined(!isjoined);
      await axios.post(`${API}/unjoinmember/${data?.id}/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommunity = async () => {
    try {
      const res = await axios.post(
        `${API}/web/removecomwithposts/${data?.id}/${id}`
      );
      if (res.data?.success) {
        router.push("/main/feed/community");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMute = async () => {
    try {
      setIsMuted(!isMuted);
      await axios.post(`${API}/mutecom/${data?.id}/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const changeComType = async () => {
    try {
      if (comtype === "public") {
        setComtype("private");
      } else {
        setComtype("public");
      }
      await axios.post(`${API}/setcomtype/${data?.id}/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTopicPurchase = async () => {
    try {
      setLoading(true);
      try {
        const res = await axios.post(
          `
          ${API}/v1/createtopicporder/${data?.id}/${topicData?.id}`,
          { path }
        );
        if (res.data.success) {
          router.push(res.data.url);
        }
        // setOpenPay(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareValue).then(() => {
      toast.success("Copied!");
    });
  };

  const fetchallPosts = async (topicid = "") => {
    try {
      const res = await axios.post(`${API}/fetchallposts/${data?.id}/${id}`, {
        postId: "",
        topicId: topicid,
      });

      if (res.data.success) {
        setIsTopicJoined(res.data?.topicjoined);
        if (res.data.topic) {
          setTopicData(res.data.topic);
        }
        setCom(res.data?.mergedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTopics = async (topicId) => {
    try {
      const res = await axios.get(
        `${API}/gettopicmessages/${data?.id}/${topicId}`
      );

      if (res.data.success) {
        dispatch(setMessages(res.data?.messages || []));
        setIsTopicJoined(res.data?.topicjoined);
        if (res.data.topic) {
          setTopicData(res.data.topic);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetch = async (topicId, nature) => {
    try {
      setTId(topicId);
      if (nature === "post") {
        setCurrentState("post");
        await fetchallPosts(topicId);
      } else {
        await fetchTopics(topicId);
        setCurrentState("chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.id && id) {
      fetchCommunity();
      fetchallPosts();
    }
  }, [id, data]);

  const handleLike = async (postId, liked) => {
    try {
      if (liked) {
        const newwfeed = com.map((d) =>
          d?.posts._id === postId
            ? {
                ...d,
                liked: false,
                posts: { ...d.posts, likes: Number(d?.posts?.likes) - 1 },
              }
            : d
        );
        setCom(newwfeed);
      } else {
        const newwfeed = com.map((d) =>
          d?.posts._id === postId
            ? {
                ...d,
                liked: true,
                posts: { ...d.posts, likes: Number(d?.posts?.likes) + 1 },
              }
            : d
        );
        setCom(newwfeed);
      }
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
    } catch (error) {
      console.log(error);
    }
  };

  // image video
  const handleSend = async () => {
    const rid = Math.floor(Math.random() * 90000000) + 10000000;
    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;
    try {
      let mess = {
        sender: { fullname: data?.fullname, _id: data?.id },
        sender_fullname: data?.fullname,
        sender_id: data?.id,
        text: msgs,
        createdAt: timestamp,
        timestamp: timer,
        mesId: rid,
        typ: type === "image" ? "image" : "video",
        comId: id,
        sequence: messages?.length + 1,
        sendtopicId: tId,
        status: "active",
        content: { content, name },
        url: content,
        comtitle: title,
      };

      // dispatch(a(false));
      const form = new FormData();
      form.append(
        type === "image"
          ? "image"
          : type === "video"
          ? "video"
          : type === "doc"
          ? "doc"
          : "doc",
        {
          uri: content,
          type:
            type === "image"
              ? "image/jpg"
              : type === "video"
              ? "video/mp4"
              : type === "doc"
              ? content?.type
              : content?.type,
          name:
            type === "image"
              ? "image.jpg"
              : type === "video"
              ? "video.mp4"
              : type === "doc"
              ? "doc.pdf"
              : "doc.pdf",
        }
      );
      form.append("data", JSON.stringify(mess));
      form.append("media", content);

      const res = await axios.post(`${API}/sendchatfile`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (uploadEvent) => {
          const uploadProgress = Math.round(
            (100 * uploadEvent.loaded) / uploadEvent.total
          );
          // setProgress({ appear: true, progress: uploadProgress });
        },
      });
      if (res.data?.success) {
        let newmess = {
          sender: { fullname: data?.fullname, _id: data?.id },
          sender_fullname: data?.fullname,
          sender_id: data?.id,
          text: msgs,
          createdAt: timestamp,
          timestamp: timer,
          mesId: rid,
          typ: type === "image" ? "image" : "video",
          comId: id,
          sequence: messages?.length + 1,
          sendtopicId: tId,
          status: "active",
          content: { content, name },
          url: res?.data?.link,
          comtitle: title,
        };

        socketemitfunc({
          event: "chatMessagecontent",
          data: { roomId: tId, userId: data?.id, data: newmess },
          socket,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // message send
  const sendMessage = async () => {
    const rid = Math.floor(Math.random() * 90000000) + 10000000;
    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;
    if (!msgs.trim()) {
      console.log("Type Something");
    } else {
      let mess = {
        sender: { fullname: data?.fullname, _id: data?.id },
        sender_fullname: data?.fullname,
        sender_id: data?.id,
        text: msgs,
        createdAt: timestamp,
        timestamp: timer,
        mesId: rid,
        // typ: reply ? 'reply' : 'message',
        typ: "message",
        comId: id,
        sequence: messages?.length + 1,
        sendtopicId: tId,
        // postId,
        comtitle: title,
        // reply: reply,
        // replyId: replyId,
        status: "active",
      };

      socketemitfunc({
        event: "chatMessage",
        data: { roomId: tId, userId: data?.id, data: mess },
        socket,
      });

      return () => {};
    }
  };

  // gif send
  const sendgif = async (url) => {
    const rid = Math.floor(Math.random() * 90000000) + 10000000;
    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;

    let mess = {
      sender: { fullname: data?.fullname, _id: data?.id },
      sender_fullname: data?.fullname,
      sender_id: data?.id,
      // text: message,
      createdAt: timestamp,
      timestamp: timer,
      mesId: rid,
      typ: "gif",
      comId: id,
      sequence: messages?.length + 1,
      sendtopicId: tId,
      // postId,
      comtitle: title,
      // reply: reply,
      // replyId: replyId,
      status: "active",
      url,
    };

    socketemitfunc({
      event: "chatMessage",
      data: { roomId: tId, userId: data?.id, data: mess },
      socket,
    });

    return () => {};
  };

  const replyFunc = async () => {
    try {
      const rid = Math.floor(Math.random() * 90000000) + 10000000;
      const timer = moment(new Date()).format("HH:mm").toString();
      const timestamp = `${new Date()}`;

      if (!msgs.trim()) {
        console.log("Type Something");
      } else {
        let mess = {
          sender_fullname: data?.fullname,
          sender_id: data?.id,
          text: msgs,
          createdAt: timestamp,
          timestamp: timer,
          mesId: rid,
          typ: "reply",
          comId: id,
          comtitle: title,
          isread: false,
          sequence: messages?.length + 1,
          sender: { _id: data?.id },
          reply: reply,
          replyId: replyId,
          readby: [],
          status: "active",
        };

        socketemitfunc({
          event: "chatMessage",
          data: { roomId: tId, userId: data?.id, data: mess },
          socket,
        });

        dispatch(setincommsgs(mess));
        // setMessage([...messages, msg])
        dispatch(setReplyFunction({ reply: "", replyId: "" }));
        dispatch(setMessage(""));
        dispatch(setType("text"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {optionType === "reports" && (
        <div className="fixed inset-0 z-40 flex justify-center items-center w-screen h-screen">
          <div className="flex justify-center flex-col  items-center h-full w-[40%]">
            <div className="text-xl">Reports</div>
            <div>
              <div
                onClick={() =>
                  !reports.includes("CopyRight Infringment") &&
                  setReports([...reports, "CopyRight Infringment"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                CopyRight Infringment
              </div>
              <div
                onClick={() =>
                  !reports.includes("Harrasment") &&
                  setReports([...reports, "Harrasment"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Harrasment
              </div>
              <div
                onClick={() =>
                  !reports.includes("Nudity") &&
                  setReports([...reports, "Nudity"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Nudity
              </div>
              <div
                onClick={() =>
                  !reports.includes("Sexual Content") &&
                  setReports([...reports, "Sexual Content"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Sexual Content
              </div>
              <div
                onClick={() =>
                  !reports.includes("Spam") && setReports([...reports, "Spam"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Spam
              </div>
              <div
                onClick={() =>
                  !reports.includes("Violence") &&
                  setReports([...reports, "Violence"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Violence
              </div>
              <div
                onClick={() =>
                  !reports.includes("Hate Speech") &&
                  setReports([...reports, "Hate Speech"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Hate Speech
              </div>
              <div
                onClick={() =>
                  !reports.includes("Other") &&
                  setReports([...reports, "Other"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Other
              </div>

              <Link
                href={`/main/feed/community/${id}`}
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Cancel
              </Link>

              <Link
                onClick={handleReport}
                href={`/main/feed/community/${id}`}
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Submit
              </Link>
            </div>
          </div>
        </div>
      )}

      {share && (
        <div
          id="course-modal"
          tabindex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center w-screen md:inset-0 h-screen max-h-full"
        >
          <div className="relative p-4 flex justify-center items-center w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-lg text-gray-500 ">Share course</h3>
                <button
                  type="button"
                  onClick={() => setShare(false)}
                  className="text-gray-400  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
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
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Share the course link below with your friends:
                </label>
                <div className="flex justify-center  items-center  border rounded-lg bg-transparent border-gray-300 text-gray-500 mb-4">
                  <input
                    id="course-url"
                    type="text"
                    className="col-span-6  text-sm  block w-full p-2.5 "
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

      {load ? (
        <Loader />
      ) : (
        <div className=" relative">
          <div className="flex items-center h-[60px] absolute top-0 z-20 w-full  bg-[#f4f4f4]">
            <div>
              <img
                src={dp}
                className="h-[45px] w-[45px] rounded-[19px] bg-yellow-300 "
              />
            </div>
            <div className="flex justify-between w-full items-center gap-2 px-4">
              <div className="flex gap-1 flex-col">
                <div>{title}</div>
                <div className="text-[12px]">
                  {memcount} {memcount > 1 ? "Members" : "Member"}
                </div>
              </div>
              <div
                onClick={() => setOptions(!options)}
                className="flex justify-center relative items-center text-3xl"
              >
                <IoReorderThreeOutline />
                {options && (
                  <div className="absolute w-[200px] z-40 text-sm h-auto -left-[170px] p-3 top-7 text-white bg-black">
                    <div className="flex flex-col gap-2 font-semibold h-full">
                      <Link href={`/main/feed/community/${id}?type=members`}>
                        Members
                      </Link>
                      {creatorId !== data?.id && (
                        <Link href={`/main/feed/community/${id}?type=reports`}>
                          Reports
                        </Link>
                      )}

                      {creatorId !== data?.id && (
                        <div>
                          {isMuted ? (
                            <div onClick={handleMute}>Un Mute</div>
                          ) : (
                            <div onClick={handleMute}>Mute</div>
                          )}
                        </div>
                      )}

                      {creatorId === data?.id ? (
                        <div onClick={deleteCommunity}>Delete</div>
                      ) : (
                        <div>
                          {isjoined ? (
                            <div onClick={() => unjoinmembers()}>Leave</div>
                          ) : (
                            <div>Join</div>
                          )}
                        </div>
                      )}
                      {data?.id === creatorId && (
                        <div>
                          {comtype === "private" ? (
                            <div onClick={changeComType}> set to public</div>
                          ) : (
                            <div onClick={changeComType}>set to private</div>
                          )}
                        </div>
                      )}
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {optionType === "members" && <Members id={data?.id} comId={id} />}

          {!optionType && (
            <div className="h-[100%] bg-[#f7f7f7] z-10 pt-[60px] w-full relative overflow-y-scroll">
              <div
                className="flex justify-center z-10  w-full py-2
         items-center
         "
              >
                {topics.map((d, i) => (
                  <div
                    onClick={() => handleFetch(d?._id, d?.nature)}
                    key={i}
                    className="w-full flex justify-center"
                  >
                    <div className="flex items-center bg-[#f2f2f2] px-4 rounded-lg ">
                      {d?.title}
                    </div>
                  </div>
                ))}
              </div>

              {currentState === "post" && (
                <>
                  {isTopicJoined ? (
                    <div>
                      {com.map((d, i) => (
                        <CommunityPost
                          id={`${d?.posts?._id}`}
                          key={`${d?.posts?._id}`}
                          d={d}
                          i={i}
                          title={title}
                          setShare={setShare}
                          data={data}
                          setShareValue={setShareValue}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center h-full items-end ">
                      <div
                        onClick={() => handleTopicPurchase()}
                        className="bg-blue-600 flex justify-center items-center text-white w-full p-2 px-5 rounded-lg"
                      >
                        {" "}
                        Unlock Topic at ₹{topicData?.price}/month
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="w-full relative ">
                {currentState === "chat" && (
                  <div
                    id="scrollableDiv"
                    style={{
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column-reverse",
                    }}
                    className="relative"
                  >
                    {/*Put the scroll bar always on the bottom*/}
                    <InfiniteScroll
                      dataLength={messages.length}
                      // next={fetchTopics}
                      style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        position: "relative",
                      }}
                      loader={<h4>Loading...</h4>}
                      scrollableTarget="scrollableDiv"
                    >
                      <div className="relative h-full w-full">
                        {messages?.map((d, i) => (
                          <CommunityChat
                            d={d}
                            data={data}
                            i={i}
                            dispatch={dispatch}
                            tId={tId}
                            socket={socket}
                            messages={messages}
                          />
                        ))}

                        <div className="h-full">
                          {isTopicJoined && (
                            <div className="bg-pink-300 sticky bottom-0 left-0 h-full">
                              {reply && replyId && (
                                <div className="flex justify-between px-4 items-center">
                                  <div>{reply}</div>
                                  <div>
                                    <RxCross2
                                      onClick={() => {
                                        dispatch(setType(""));
                                        dispatch(
                                          setReplyFunction({
                                            reply: "",
                                            replyId: "",
                                          })
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              <Input
                                sendMessages={sendMessage}
                                sendgif={sendgif}
                                senderId={data?.id}
                                sender_fullname={data?.fullname}
                                handleSend={handleSend}
                                dispatch={dispatch}
                                setContent={setContent}
                                setMessage={setMessage}
                                image={data?.dp}
                                setType={setType}
                                setincommsgs={setincommsgs}
                                type={type}
                                reply={replyFunc}
                                name={name}
                                setMessages={setMessages}
                                content={content}
                                size={size}
                                message={msgs}
                              />
                            </div>
                          )}
                          {!isTopicJoined && (
                            <div className="flex justify-center h-full items-end ">
                              <div
                                onClick={() => handleTopicPurchase()}
                                className="bg-blue-600 flex justify-center items-center text-white w-full p-2 px-5 rounded-lg"
                              >
                                {" "}
                                Unlock Topic at ₹{topicData?.price}/month
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CommunityFeed;
