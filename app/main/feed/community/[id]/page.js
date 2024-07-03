"use client";
import { API } from "../../../../../Essentials";
import Input from "../../../../component/Input";
import { useAuthContext } from "../../../../utils/AuthWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  socketemitfunc,
  useSocketContext,
} from "../../../../utils/SocketWrapper";
import {
  setContent,
  setMessage,
  setMessages,
  setReplyFunction,
  setType,
  setincommsgs,
} from "../../../../redux/slice/comChatSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CommunityChat from "@/app/component/CommunityChat";
import { RxCross2 } from "react-icons/rx";
import Members from "@/app/component/Members";
import Link from "next/link";
import CommunityPost from "@/app/component/CommunityPost";
import Loader from "@/app/component/Loader";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import reportspic from "../../../../assets/reports.png";
import mutepic from "../../../../assets/mute.png";
import logout from "../../../../assets/logout.png";
import unmutepic from "../../../../assets/unmute.png";
import memberspic from "../../../../assets/members.png";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { setPreview } from "@/app/redux/slice/remember";
import { IoDocument } from "react-icons/io5";

function Components({ params }) {
  const { data } = useAuthContext();
  const { socket } = useSocketContext();
  const [com, setCom] = useState([]);
  const [dp, setDp] = useState("");
  const [title, setTitle] = useState("");
  const [topics, setTopics] = useState([]);
  const [tId, setTId] = useState("");
  // const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [shareValue, setShareValue] = useState("");
  const [share, setShare] = useState(false);
  const [currentState, setCurrentState] = useState("post");
  const [memcount, setMemcount] = useState(0);
  const [isTopicJoined, setIsTopicJoined] = useState(false);
  const [topicData, setTopicData] = useState("");
  const [isjoined, setIsjoined] = useState(false);
  const path = usePathname();
  const [load, setLoad] = useState(true)
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
  const preview = useSelector((state) => state.remember.preview);
  const msgs = useSelector((state) => state.comChat.message);
  const [reports, setReports] = useState([]);
  const [comtype, setComtype] = useState("");
  const reply = useSelector((state) => state.comChat.reply);
  const replyId = useSelector((state) => state.comChat.replyId);
  const [creatorId, setCreatorId] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  const fetchCommunity = async () => {
    try {
      setLoad(true)
      const res = await axios.get(
        `${API}/compostfeed/${data?.id}/${params?.id}`
      );
      if (res.data.success) {
        setMemcount(res?.data?.community?.memberscount);
        setIsMuted(res.data?.muted[0]?.muted);
        setMembers(res.data?.members);
        setTitle(res.data?.community?.title);
        setTId(res.data?.community?.topics[0]._id);
        setComtype(res.data?.community?.type);
        setCreatorId(res.data?.community?.creator._id);
        setTopics(res.data?.community.topics);
        setIsjoined(res.data?.subs);
        setDp(res.data?.dp);
        setLoad(false)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoad(false)
    }
  };

  const handleReport = async () => {
    try {
      if (reports?.length > 0) {
        await axios.post(`${API}/web/reporting/${data?.id}`, {
          data: reports,
          id: params?.id,
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
      await axios.post(`${API}/unjoinmember/${data?.id}/${params?.id}`);
      router.push("/main/feed/community")
    } catch (error) {
      console.log(error);
    }
  };

  const joinmembers = async () => {
    try {
      const res = await axios.post(
        `${API}/joinmember/${data?.id}/${params?.id}`
      );
      if (res.data.success) {
        await fetchCommunity();
        await fetchallPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCommunity = async () => {
    try {
      const res = await axios.post(
        `${API}/web/removecomwithposts/${data?.id}/${params?.id}`
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
      await axios.post(`${API}/mutecom/${data?.id}/${params?.id}`);
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
      await axios.post(`${API}/setcomtype/${data?.id}/${params?.id}`);
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
      const res = await axios.post(
        `${API}/fetchallposts/${data?.id}/${params?.id}`,
        { postId: "", topicId: topicid }
      );

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
    if (data?.id && params?.id) {
      fetchCommunity();
      fetchallPosts();
    }
  }, [params?.id, data]);

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
        comId: params?.id,
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
          comId: params?.id,
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
        comId: params?.id,
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

      return () => { };
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
      comId: params?.id,
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

    return () => { };
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
          comId: params?.id,
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
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-bluedark rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
            <div className="text-2xl font-semibold mb-4 text-center">
              Reports
            </div>
            <div className="space-y-3 text-sm">
              <div
                onClick={() => {
                  if (reports.includes("CopyRight Infringement")) {
                    setReports(
                      reports.filter(
                        (report) => report !== "CopyRight Infringement"
                      )
                    );
                  } else {
                    setReports([...reports, "CopyRight Infringement"]);
                  }
                }}
                className={`p-3 ${reports.includes("CopyRight Infringement")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                CopyRight Infringement
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Harrassment")) {
                    setReports(
                      reports.filter((report) => report !== "Harrassment")
                    );
                  } else {
                    setReports([...reports, "Harrassment"]);
                  }
                }}
                className={`p-3 ${reports.includes("Harrassment")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Harrassment
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Nudity")) {
                    setReports(reports.filter((report) => report !== "Nudity"));
                  } else {
                    setReports([...reports, "Nudity"]);
                  }
                }}
                className={`p-3 ${reports.includes("Nudity")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Nudity
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Sexual Content")) {
                    setReports(
                      reports.filter((report) => report !== "Sexual Content")
                    );
                  } else {
                    setReports([...reports, "Sexual Content"]);
                  }
                }}
                className={`p-3 ${reports.includes("Sexual Content")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Sexual Content
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Spam")) {
                    setReports(reports.filter((report) => report !== "Spam"));
                  } else {
                    setReports([...reports, "Spam"]);
                  }
                }}
                className={`p-3 ${reports.includes("Spam")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Spam
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Violence")) {
                    setReports(
                      reports.filter((report) => report !== "Violence")
                    );
                  } else {
                    setReports([...reports, "Violence"]);
                  }
                }}
                className={`p-3 ${reports.includes("Violence")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Violence
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Hate Speech")) {
                    setReports(
                      reports.filter((report) => report !== "Hate Speech")
                    );
                  } else {
                    setReports([...reports, "Hate Speech"]);
                  }
                }}
                className={`p-3 ${reports.includes("Hate Speech")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Hate Speech
              </div>
              <div
                onClick={() => {
                  if (reports.includes("Other")) {
                    setReports(reports.filter((report) => report !== "Other"));
                  } else {
                    setReports([...reports, "Other"]);
                  }
                }}
                className={`p-3 ${reports.includes("Other")
                  ? "bg-[#0077ff85]"
                  : "bg-gray-200 dark:bg-[#1A1D21]"
                  } rounded-lg  dark:text-white  text-gray-800 cursor-pointer`}
              >
                Other
              </div>
              <div className="flex justify-between mt-4">
                <Link
                  onClick={() => {
                    setReports([]);
                  }}
                  href={`/main/feed/community/${params?.id}`}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel
                </Link>
                <Link
                  onClick={handleReport}
                  href={`/main/feed/community/${params?.id}`}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Submit
                </Link>
              </div>
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
            <div className="relative bg-white dark:bg-[#1A1D21] rounded-lg shadow ">
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-lg text-gray-500 dark:text-white">Share course</h3>
                <button
                  type="button"
                  onClick={() => setShare(false)}
                  className="text-gray-400  hover:dark:bg-gray-400  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center"
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
                <div className="flex justify-center  items-center dark:bg-bluelight  border rounded-lg bg-transparent border-gray-300 text-gray-500 mb-4">
                  <input
                    id="course-url"
                    type="text"
                    className="col-span-6 rounded-lg  dark:bg-bluelight dark:text-selectdark text-sm  block w-full p-2.5 "
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

      {
        load ? <Loader /> :
          <div className="h-screen relative">
            <div className="flex items-center h-[10%] z-20 w-full pl-2  bg-white dark:border-none border-b-[1px] dark:bg-bluedark">
              <div className="flex items-center gap-2 justify-center">
                {/* <div>
                  <MdOutlineArrowBackIosNew className="text-2xl" />
                </div> */}
                <div>
                  <img
                    src={dp}
                    className="h-[45px] w-[45px] rounded-[14px] bg-slate-300 "
                  />
                </div>
              </div>
              <div className="flex justify-between w-full items-center gap-2 px-4">
                <div className="flex gap-1 flex-col">
                  <div className="font-bold">{title}</div>
                  <div className="text-[12px]">
                    {memcount} {memcount > 1 ? "Members" : "Member"}
                  </div>
                </div>
                {/* <div
                  onClick={() => setOptions(!options)}
                  className="flex justify-center relative items-center text-3xl"
                >
                  <IoReorderThreeOutline />

                  <div className={`absolute duration-100 ${options
                    ? "w-[200px] p-2 top-7 text-sm h-auto -left-[170px] "
                    : "w-0 h-0 text-[0px] top-0 left-0"
                    } z-40 rounded-lg dark:text-white text-[#6e6e6e] bg-white dark:bg-[#4c66ad]`}>
                    <div className="flex flex-col gap-2 font-semibold h-full">
                      <Link
                        href={`/main/feed/community/${params?.id}?type=members`}
                      >
                        Members
                      </Link>
                      {creatorId !== data?.id && (
                        <Link
                          href={`/main/feed/community/${params?.id}?type=reports`}
                        >
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

                </div> */}

                <div className="flex justify-center items-center  gap-2">
                  <div className="flex justify-center items-center ">
                    {members?.map((m, y) => (
                      <div
                        style={{
                          marginLeft: `-${y + 10}px`,
                          zIndex: `${y}`,
                        }}
                        key={y}
                        className="w-[32px] h-[32px]"
                      >
                        <img
                          src={m?.dp}
                          className="h-full object-contain rounded-[22px] w-full"
                        />
                      </div>
                    ))}
                    <div
                      style={{
                        marginLeft: `-${members.length + 10}px`,
                      }}
                      className="h-[32px] z-10 flex justify-center items-center text-[10px] text-[#686B6E] rounded-[22px] bg-[#1A1D21] w-[32px]"
                    >
                      <div>+</div>
                      <div>{memcount - members.length}</div>
                    </div>
                  </div>
                  <div
                    onClick={() => setOptions(!options)}
                    className="flex justify-center relative gap-2 items-center "
                  >

                    <BsThreeDotsVertical />
                    <div
                      className={`absolute duration-100 ${options
                        ? "w-auto p-2 px-4 top-7 text-sm h-auto -left-[140px] "
                        : "w-0 h-0 text-[0px] top-0 left-0"
                        } z-40 rounded-lg dark:text-white text-[#6e6e6e] bg-white shadow-custom-lg dark:bg-[#0D0F10]`}
                    >
                      {" "}
                      <div className="flex flex-col font-semibold h-full">
                        <Link
                          className="rounded-lg flex items-center justify-start"
                          href={`/main/feed/community/${params?.id}?type=members`}
                        >
                          <div className="flex justify-center  items-center">
                            <Image
                              src={memberspic}
                              className={`relative top-2 max-w-[40px] max-h-[40px] flex justify-center items-center h-full ${options ? "" : "hidden"
                                } `}
                            />
                          </div>
                          <div className="">Members</div>
                        </Link>
                        {creatorId !== data?.id && (
                          <Link
                            className="flex items-center justify-start"
                            href={`/main/feed/community/${params?.id}?type=reports`}
                          >
                            <div className="flex justify-center  items-center">
                              <Image
                                src={reportspic}
                                className={`relative top-2 max-w-[40px] max-h-[40px] flex justify-center items-center h-full ${options ? "" : "hidden"
                                  } `}
                              />
                            </div>
                            <div>Reports</div>
                          </Link>
                        )}

                        {creatorId !== data?.id && (
                          <div className="">
                            {isMuted ? (
                              <div
                                onClick={handleMute}
                                className="flex items-center justify-start"
                              >
                                <div className="flex justify-center items-center">
                                  <Image
                                    src={unmutepic}
                                    className={`relative top-2 max-w-[40px] max-h-[40px] flex justify-center items-center h-full ${options ? "" : "hidden"
                                      } `}
                                  />
                                </div>
                                <div>Un Mute</div>
                              </div>
                            ) : (
                              <div
                                onClick={handleMute}
                                className="flex items-center justify-start"
                              >
                                <div className="flex justify-center  items-center">
                                  <Image
                                    src={mutepic}
                                    className={`relative top-2 max-w-[40px] max-h-[40px] flex justify-center items-center h-full ${options ? "" : "hidden"
                                      } `}
                                  />
                                </div>
                                <div>Mute</div>
                              </div>
                            )}
                          </div>
                        )}

                        {creatorId === data?.id ? (
                          <div onClick={deleteCommunity}>Delete</div>
                        ) : (
                          <div>
                            {isjoined ? (
                              <div
                                className="flex items-center justify-start"
                                onClick={() => unjoinmembers()}
                              >
                                <div className="flex justify-center  items-center">
                                  <Image
                                    src={logout}
                                    className={`relative top-2 max-w-[40px] max-h-[40px] flex justify-center items-center h-full ${options ? "" : "hidden"
                                      } `}
                                  />
                                </div>
                                <div>Leave</div>
                              </div>
                            ) : (
                              <div onClick={() => joinmembers()}>Join</div>
                            )}
                          </div>
                        )}
                        {data?.id === creatorId && (
                          <div>
                            {comtype === "private" ? (
                              <div onClick={changeComType}>
                                {" "}
                                set to public
                              </div>
                            ) : (
                              <div onClick={changeComType}>
                                set to private
                              </div>
                            )}
                          </div>
                        )}
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`z-40 duration-200 flex justify-end items-end h-[100vh] top-0 w-full absolute ${optionType === "members" ? "" : "hidden"
                }`}
            >
              <div
                className={`pn:max-md:w-[100%] dark:shadow-custom-lg shadow-lg duration-200 max-h-[90%] ${optionType === "members" ? "" : "hidden"
                  } overflow-y-scroll  md:min-w-[340px] md:max-w-[340px] flex-col`}
              >
                <Members
                  id={data?.id}
                  comId={params?.id}
                  dash={"community"}
                />
              </div>
            </div>

            {(!optionType || optionType === "members") && (
              <div
                className={`w-full relative overflow-y-scroll ${currentState === "chat"
                  ? reply && replyId
                    ? "h-[78%]"
                    : "h-[82%]"
                  : "h-[90%]"
                  }`}
              >

                <div className="flex gap-2  border-b dark:border-[#131619]">
                  <div className="flex gap-6 ml-4 text-sm">
                    {topics.map((d, i) => (
                      <div
                        onClick={() => handleFetch(d?._id, d?.nature)}
                        key={i}
                        className="flex "
                      >
                        <div
                          className={`flex cursor-pointer items-center px-4 py-4 ${tId === d?._id
                            ? " dark:text-white border-b font-semibold border-[#0077FF]"
                            : "text-[#9B9C9E] "
                            }  `}
                        >
                          {d?.title}
                        </div>
                      </div>
                    ))}
                  </div>
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
                            comId={params?.id}
                            title={title}
                            setShare={setShare}
                            data={data}
                            setShareValue={setShareValue}
                            handleLike={handleLike}
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

                {/* {currentState === "chat" && (
              <div className="w-full  ">
                <div
                  id="scrollableDiv"
                  style={{
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                  className=""
                >
                
                  <InfiniteScroll
                    dataLength={messages.length}
                    
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
                            
                              Unlock Topic at ₹{topicData?.price}/month
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            )} */}

                {currentState === "chat" && (
                  <div className=" w-full px-2">
                    {preview === false && <>
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

                    </>}


                    {preview && (
                      <div className="w-full h-[70vh]">
                        <div className="flex flex-col w-full justify-center items-center h-full ">
                          <div
                            onClick={() => {
                              dispatch(setType(""));
                              dispatch(setContent(""));

                              dispatch(setPreview(false));
                            }}
                            className="flex justify-end items-end mr-7 w-full"
                          >
                            <RxCross2 className="text-2xl" />
                          </div>
                          <div className="h-full justify-center items-center flex">
                            {type === "image" && content && (
                              <div className="h-full flex w-full justify-center items-center">
                                <img
                                  className="max-h-[500px] max-w-[500px] flex"
                                  src={
                                    typeof content === "string"
                                      ? content
                                      : URL.createObjectURL(content)
                                  }
                                />
                              </div>
                            )}
                            {type === "video" && content && (
                              <div className="h-full flex w-full justify-center items-center">
                                <video
                                  className="max-h-[500px] max-w-[500px] flex"
                                  src={URL.createObjectURL(content)}
                                  controls
                                />
                              </div>
                            )}
                            {type === "gif" && content && (
                              <div className="h-full flex w-full bg-green-200 justify-center items-center">
                                <img
                                  className="max-h-[500px] max-w-[500px] bg-red-300 flex"
                                  src={
                                    typeof content === "string"
                                      ? content
                                      : URL.createObjectURL(content)
                                  }
                                />
                              </div>
                            )}
                            {type === "doc" && content && (
                              <div className="h-full flex gap-4 flex-col w-full justify-center items-center">
                                <div className="flex gap-1 justify-center items-center">
                                  <div className="">
                                    <IoDocument className="w-[50px] h-[50px]" />
                                  </div>
                                  <div className="text-xl">{name}</div>
                                </div>
                                <div className="text-xl">
                                  No Preview Available
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {isTopicJoined && (
                    <div className="bg-pink-300 absolute mt-[60px]">
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
                        handleSend={handleSend}
                        setContent={setContent}
                        setMessage={setMessage}
                        senderId={data?.id}
                        sender_fullname={data?.fullname}
                        setType={setType}
                        type={type}
                        name={name}
                        setMessages={setMessages}
                        setincommsgs={setincommsgs}
                        content={content}
                        size={size}
                        message={msgs}
                        dispatch={dispatch}
                        image={data?.dp}
                        reply={replyFunc}
                      />
                    </div>
                  )} */}

                    {!isTopicJoined && (
                      <>
                        <div className="flex justify-center h-full items-end ">
                          <div className="bg-blue-600 flex justify-center items-center text-white w-full p-2 px-5 rounded-lg">
                            {" "}
                            Unlock Topic at ₹{topicData?.price}/month
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {currentState === "chat" && (
              <div className={`bg-[#fff] duration-75 flex border-t-2 dark:bg-bluelight justify-center ${reply && replyId
                ? "h-[12%] gap-2 space-y-2"
                : "h-[8%] items-center"
                }`}>
                {isTopicJoined && (
                  <div className="bg-white dark:bg-bluelight flex flex-col items-center w-full justify-center h-[100%]">
                    {reply && replyId && (
                      <div className="flex justify-between w-full px-3 h-[40px] items-center">
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
                    <div className="w-full px-2">
                      <Input
                        sendMessages={sendMessage}
                        sendgif={sendgif}
                        handleSend={handleSend}
                        setContent={setContent}
                        setMessage={setMessage}
                        senderId={data?.id}
                        sender_fullname={data?.fullname}
                        setType={setType}
                        type={type}
                        name={name}
                        setMessages={setMessages}
                        setincommsgs={setincommsgs}
                        content={content}
                        size={size}
                        message={msgs}
                        dispatch={dispatch}
                        image={data?.dp}
                        reply={replyFunc}
                        stt
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div >
      }
    </>
  );
}

export default Components;
