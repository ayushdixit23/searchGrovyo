"use client";
import { API } from "../../../../../Essentials";
import Input from "../../../../component/Input";
import { useAuthContext } from "../../../../utils/AuthWrapper";
import {
  socketemitfunc,
  useSocketContext,
} from "../../../../utils/SocketWrapper";
import axios from "axios";
import moment from "moment";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removechatmsg,
  setContent,
  setMessage,
  setMessages,
  setReplyFunction,
  setType,
  setincommsgs,
} from "../../../../redux/slice/messageSlice";
// default

import styles from "../../../../CustomScrollbarComponent.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { LuLoader2 } from "react-icons/lu";
import PrivateChats from "../../../../component/PrivateChats";
import Hidden from "../../../../component/Hidden";
import { IoReorderThreeOutline } from "react-icons/io5";
import Link from "next/link";
import { setConvId, setPreview } from "@/app/redux/slice/remember";
import { RxCross2 } from "react-icons/rx";

const Components = () => {
  const { data } = useAuthContext();
  const { socket } = useSocketContext();
  const searchParams = useSearchParams();
  const [end, setEnd] = useState(true);
  const optionType = searchParams.get("type");
  const [isBlocked, setIsBlocked] = useState(false);
  const [canblock, setCanblock] = useState(false);
  const [reports, setReports] = useState([]);
  const params = useParams();
  const [user, setUser] = useState();
  const messages = useSelector((state) => state.message.messages);
  const [options, setOptions] = useState(false);
  const dispatch = useDispatch();
  const type = useSelector((state) => state.message.type);
  const name = useSelector((state) => state.message.name);
  const preview = useSelector((state) => state.remember.preview);
  const content = useSelector((state) => state.message.content);
  const size = useSelector((state) => state.message.size);
  const msg = useSelector((state) => state.message.message);
  const reply = useSelector((state) => state.message.reply);
  const replyId = useSelector((state) => state.message.replyId);
  const messageRefs = useRef({});
  const [istyping, setIstyping] = useState(false);

  useEffect(() => {
    messages.forEach((message) => {
      messageRefs.current[message.mesId] = React.createRef();
    });
  }, [messages]);

  const handleScrollToMessage = (mesId) => {
    const targetRef = messageRefs.current[mesId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const limitWords = (text, wordLimit) => {
    // const words = text.split(" ");
    return text.length > wordLimit ? text.slice(0, wordLimit) + ".." : text;
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(
        `${API}/fetchconvs/${data?.id}/${params?.id}/${params?.con}`
      );

      setIsBlocked(res.data.isblocked);
      setCanblock(res.data.canblock);
      setUser(res.data.otheruserdetails);
      dispatch(setMessages(res.data.messages || []));
    } catch (error) {
      console.log(error);
    }
  };

  const sendm = async (rid) => {
    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;

    if (!msg.trim()) {
      console.log("Type Something");
    } else {
      let mess = {
        sender_fullname: data?.fullname,
        sender_id: data?.id,
        text: msg,
        createdAt: timestamp,
        timestamp: timer,
        mesId: rid,
        typ: "message",
        // typ: reply ? 'reply' : 'message',
        convId: params?.con,
        reciever: params?.id,
        reciever_pic: user?.profilepic,
        isread: false,
        sequence: messages?.length + 1,
        sender: { _id: data?.id },
        // reply: reply,
        // replyId: replyId,
        readby: [],
        status: "active",
      };
      let ext = {
        convid: params?.con,
        fullname: data?.fullname,
        id: data?.id,
        isverified: data?.isverified,
        msgs: [
          {
            conversationId: params?.con,
            createdAt: timestamp,
            isread: false,
            mesId: rid,
            sender: data?.id,
            sequence: messages?.length + 1,
            text: msg,
            timestamp: timer,
            // typ: reply ? 'reply' : 'message',
            typ: "message",
            // reply: reply,
            // replyId: replyId,
            status: "active",
          },
        ],
        pic: data?.dp,
        username: data?.username,
        readby: [],
      };

      socketemitfunc({
        event: "singleChatMessage",
        data: { roomId: params?.id, userId: data?.id, data: mess, ext: ext },
        socket,
      });
      socketemitfunc({
        event: "typing",
        data: { userId: data?.id, roomId: params?.id, status: false },
        socket,
      });

      // setMessage([...messages, msg])

      dispatch(setMessage(""));
      dispatch(setType("text"));
    }
  };

  useEffect(() => {
    if (!socket?.connected) {
      socket?.connect();

      setTimeout(() => {
        console.log("Reconnecting from useeffect...", socket?.connected);
      }, 1000);
    } else {
      console.log(socket, "c");
      socket?.on("ms", (dat) => {
        socketemitfunc({
          event: "readnow",
          data: { userId: data?.id, roomId: params?.id, mesId: dat?.mesId },
          socket,
        });
      });

      socket?.on("reads", (dat) => {
        console.log("reads", dat);
        socketemitfunc({
          event: "readnow",
          data: { userId: data?.id, roomId: data?.id, mesId: dat?.mesId },
          socket,
        });
      });

      //marking as read
      socket?.on("readconvs", (dat) => {
        console.log("readconvs", dat);
        socketemitfunc({
          event: "successreadnow",
          data: { userId: data?.id, roomId: data?.id, mesId: dat?.mesId },
          socket,
        });
      });

      //listening for blocking event
      socket?.on("afterblock", (dat) => {
        if (dat?.id === data?.id) {
          // dispatch(setisblock(dat?.action));
          setIsBlocked(dat?.action);
        }
      });

      //listening typing status
      socket?.on("istyping", (dat) => {
        const { id, status } = dat;
        // dispatch(settypingstatus({ status, id }));
      });

      //listening for delete for everyone
      socket?.on("deleted", (dat) => {
        // dispatch(removeselectedmsgseveryonewithsockets(dat));
      });
    }

    return () => {
      // dispatch(clearcurrentconvId());
      socket?.off("ms");
      // socket?.off("outer-private");
      socket?.off("readconvs");
      socket?.off("istyping");
      socket?.off("deleted");
    };
  }, [params?.con, data?.id, socket]);

  const loadmore = async () => {
    try {
      if (messages?.length >= 20) {
        // setLoad(true);
        const res = await axios.post(
          `${API}/loadmorechatmsg/${data?.id}`,
          {
            convId: params.con,
            sequence: parseInt(
              // loadedmessages[0]?.sequence
              // 	? loadedmessages[0]?.sequence:
              messages[0]?.sequence
            ),
          },
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );

        if (res.data.success) {
          const newMessages = res.data.messages;
          // console.log(newMessages, "message", res.data)
          // dispatch(sendmoreconvmessage(newMessages));

          // dispatch(setMessages([...newMessages, ...messages]));
          dispatch(setMessages([...newMessages, ...messages]));
          if (res.data.messages.length > 0) {
            // setEnd(true);
            setEnd(false);
          } else {
            setEnd(true);
          }
        }
      }
      // setLoad(false);
    } catch (e) {
      // detecterror({ e });
      console.log(e, "Error");
    }
    // setLoad(false);
  };

  useEffect(() => {
    dispatch(setConvId(params?.con));
  }, [params?.con]);

  //gif sending
  const sendgif = async (ur, rid) => {
    // setLoad(true);

    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;

    const mess = {
      sender_fullname: data?.fullname,
      sender_id: data?.id,
      text: msg,
      createdAt: timestamp,
      timestamp: timer,
      mesId: rid,
      typ: "gif",
      convId: params?.con,
      reciever: params?.id,
      isread: false,
      sequence: messages.length + 1,
      sender: { _id: data?.id },
      //  content: {content, name: docname, size: size},
      url: ur,
      status: "active",
      readby: [],
    };

    dispatch(setincommsgs(mess));

    // dispatch(setattachopen(false));
    const form = new FormData();
    form.append("gif", {
      uri: ur,
      type: "image/gif",
      name: "new.pdf",
    });
    form.append("data", JSON.stringify(mess));

    try {
      const res = await axios.post(`${API}/sendchatfile`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data?.success) {
        const newmess = {
          sender_fullname: data?.fullname,
          sender_id: data?.id,

          createdAt: timestamp,
          timestamp: timer,
          mesId: rid,
          typ: "gif",
          convId: params?.con,
          reciever: params?.id,
          isread: false,
          sequence: messages.length + 1,
          sender: { _id: data?.id },
          // content: {content:ur, name: docname, size: formattedSize},
          url: res?.data?.link,
          readby: [],
          status: "active",
        };
        let ext = {
          convid: params?.con,
          fullname: data?.fullname,
          id: data?.id,
          isverified: data?.isverified,
          msgs: [
            {
              conversationId: params?.con,
              createdAt: timestamp,
              isread: false,
              mesId: rid,
              sender: data?.id,
              sequence: messages.length + 1,
              timestamp: timer,
              status: "active",
              typ: "gif",
            },
          ],
          pic: data?.profilepic,
          username: data?.username,
          readby: [],
        };
        socketemitfunc({
          event: "singleChatContent",
          data: {
            roomId: params?.id,
            userId: data?.id,
            data: newmess,
            ext: ext,
          },
          socket,
        });

        dispatch(setMessage(""));
        dispatch(setContent(""));
        dispatch(setType("text"));
      }
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  useEffect(() => {
    if (params?.id && params?.con && data?.id) {
      fetchChats();
    }
  }, [params?.id, params?.con, data?.id]);

  const handleSend = async (rid) => {
    const timer = moment(new Date()).format("HH:mm").toString();
    const timestamp = `${new Date()}`;

    const mess = {
      sender_fullname: data?.fullname,
      sender_id: data?.id,
      text: msg,
      createdAt: timestamp,
      timestamp: timer,
      mesId: rid,
      typ:
        type === "image"
          ? "image"
          : type === "video"
          ? "video"
          : type === "doc"
          ? "doc"
          : "message",
      convId: params?.con,
      reciever: params?.id,
      isread: false,
      sequence: messages.length + 1,
      sender: { _id: data?.id },
      content: { content, name, size },
      url: content,
      status: "active",
      readby: [],
    };

    const form = new FormData();
    form.append(
      type === "image"
        ? "image"
        : type === "video"
        ? "video"
        : type === "doc"
        ? "doc"
        : "doc",
      JSON.stringify({
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
      })
    );
    form.append("media", content);
    form.append("data", JSON.stringify(mess));

    try {
      //const res = await sendfile({data: form});
      //   console.log(res.data);
      // setLoad(true);

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
        const newmess = {
          sender_fullname: data?.fullname,
          sender_id: data?.id,
          text: msg,
          createdAt: timestamp,
          timestamp: timer,
          mesId: rid,
          typ:
            type === "image"
              ? "image"
              : type === "video"
              ? "video"
              : type === "doc"
              ? "doc"
              : "message",
          convId: params?.con,
          reciever: params?.id,
          isread: false,
          sequence: messages.length + 1,
          sender: { _id: data?.id },
          content: { content, name, size },
          url: res?.data?.link,
          readby: [],
          status: "active",
        };
        let ext = {
          convid: params?.con,
          fullname: data?.fullname,
          id: data?.id,
          isverified: data?.isverified,
          msgs: [
            {
              conversationId: params?.con,
              createdAt: timestamp,
              isread: false,
              mesId: rid,
              sender: data?.id,
              sequence: messages.length + 1,
              text: msg,
              timestamp: timer,
              status: "active",
              typ:
                type === "image"
                  ? "image"
                  : type === "video"
                  ? "video"
                  : type === "doc"
                  ? "doc"
                  : "message",
            },
          ],
          pic: data?.profilepic,
          username: data?.username,
          readby: [],
        };
        socketemitfunc({
          event: "singleChatContent",
          data: {
            roomId: params?.id,
            userId: data?.id,
            data: newmess,
            ext: ext,
          },
          socket,
        });

        // dispatch(sendconvmessage(mess));
        // dispatch(sendchats({ data: ext }));

        //   nav.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async ({ type }) => {
    try {
      if (reports?.length > 0) {
        await axios.post(`${API}/web/reporting/${data?.id}`, {
          data: reports,
          id: params?.con,
          type: type,
        });
      } else {
        console.log("Something went wrong...");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleBlock = async () => {
    try {
      socketemitfunc({
        event: "blockperson",
        data: {
          roomId: params?.con,
          userId: data?.id,
          rec: params?.id,
          action: canblock,
        },
        socket,
      });
      const res = await axios.post(`${API}/blockpeople/${data?.id}`, {
        userid: params?.id,
        time: Date.now(),
      });
      if (res.data.success) {
        setCanblock(!canblock);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const replyFunc = async (rid) => {
    try {
      const timer = moment(new Date()).format("HH:mm").toString();
      const timestamp = `${new Date()}`;

      if (!msg.trim()) {
        console.log("Type Something");
      } else {
        let mess = {
          sender_fullname: data?.fullname,
          sender_id: data?.id,
          text: msg,
          createdAt: timestamp,
          timestamp: timer,
          mesId: rid,
          typ: "reply",
          convId: params?.con,
          reciever: params?.id,
          reciever_pic: user?.profilepic,
          isread: false,
          sequence: messages?.length + 1,
          sender: { _id: data?.id },
          reply: reply,
          replyId: replyId,
          readby: [],
          status: "active",
        };
        let ext = {
          convid: params?.con,
          fullname: data?.fullname,
          id: data?.id,
          isverified: data?.isverified,
          msgs: [
            {
              conversationId: params?.con,
              createdAt: timestamp,
              isread: false,
              mesId: rid,
              sender: data?.id,
              sequence: messages?.length + 1,
              text: msg,
              timestamp: timer,
              typ: "reply",
              reply: reply,
              replyId: replyId,
              status: "active",
            },
          ],
          pic: data?.dp,
          username: data?.username,
          readby: [],
        };

        socketemitfunc({
          event: "singleChatMessage",
          data: { roomId: params?.id, userId: data?.id, data: mess, ext: ext },
          socket,
        });
        socketemitfunc({
          event: "typing",
          data: { userId: data?.id, roomId: params?.id, status: false },
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

  useEffect(() => {
    socket?.on("reads", (dat) => {
      console.log("reads", dat, params.id, data.id, "mine");

      socket.emit("readnow", {
        userId: data?.id,
        roomId: params?.id,
        mesId: dat?.mesId,
      });
    });

    socket?.on("readnow", async ({ userId, roomId, mesId }) => {
      let data = { id: userId, mesId };
      socket.to(roomId).emit("readconvs", data);
      console.log("read", data?.id);
    });

    socket?.on("readconvs", (dat) => {
      console.log("readedconvs", dat);

      const updatedMessages = messages.map((f) => {
        console.log(dat?.mesId === f?.mesId, dat?.mesId, f?.mesId);

        return {
          ...f,
          readby: [params?.id, data?.id],
        };
      });
      console.log("Updated messages:", updatedMessages);
      // Dispatch the updated messages
      dispatch(setMessages(updatedMessages));

      socket?.emit("successreadnow", {
        userId: data?.id,
        roomId: params?.id,
        mesId: dat?.mesId,
      });
    });

    // Listener for the "istypingext" event (typing status)
    socket?.on("istypingext", (data) => {
      if (data?.convId === params?.con) {
        setIstyping(true);
        setTimeout(() => {
          setIstyping(false);
        }, 3000);
      }
    });

    // Listener for the "deletedext" event (delete message)
    socket?.on("deletedext", (dat) => {
      const updatedMessages = messages.map((f) => {
        if (f.mesId === dat) {
          return { ...f, status: "deleted" };
        } else {
          return f;
        }
      });

      dispatch(removechatmsg(dat));
    });

    // Listener for the "afterblock" event (block user)
    socket?.on("afterblock", (dat) => {
      console.log(dat, "blocking");
      setIsBlocked(dat.action);
      // dispatch(removeselectedmsgseveryonewithsockets(dat));
    });

    // Clean up event listeners when the component unmounts or dependencies change
    return () => {
      // dispatch(clearcurrentconvId());
      // socket?.off("outer-private");
      socket?.off("readconvs");
      socket?.off("istyping");
      socket?.off("deletedtext");
    };
  }, [params?.con, data?.id, socket, messages]);

  return (
    <>
      {optionType === "reports" && (
        <div className="fixed inset-0 z-40 flex justify-center items-center w-screen h-screen">
          <div className="flex justify-center flex-col bg-white items-center h-full w-[40%]">
            <div className="text-xl">Reports</div>
            <div>
              <div
                onClick={() =>
                  !reports.includes("CopyRight Infringment") &&
                  setReports([...reports, "CopyRight Infringment"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                CopyRight Infringement
              </div>
              <div
                onClick={() =>
                  !reports.includes("Harrasment") &&
                  setReports([...reports, "Harrasment"])
                }
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Harrassment
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
                href={`/main/chat/${params?.id}/${params?.con}`}
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Cancel
              </Link>

              <Link
                onClick={handleReport}
                href={`/main/chat/${params?.id}/${params?.con}`}
                className="p-2 px-5 rounded-xl bg-black text-white"
              >
                Submit
              </Link>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => setOptions(false)}
        className={`fixed inset-0 ${
          options ? "z-40" : "-z-20"
        } w-screen h-screen`}
      ></div>
      <div className="w-full h-[100vh] relative ">
        {/* header  */}
        <div
          className="w-[100%] gap-2 bg-white dark:bg-bluelight dark:border-[#273142]  border-[#888]  justify-between items-center h-[8%] 
        border-b-[0.5px] border-b-gray-200 px-4 flex flex-row "
        >
          <a
            target="_blank"
            href={`https://grovyo.com/${user?.username}`}
            className="flex flex-row items-center w-full h-full gap-2"
          >
            <div>
              <img
                src={user?.profilepic}
                className="h-[45px] w-[45px] rounded-[20px] ring-1 dark:ring-[#273142] ring-white bg-white-300 "
              />
            </div>
            <div>
              <div className="text-[15px] font-medium">{user?.fullname}</div>
              <div className="text-[14px]">{istyping ? "Typing..." : ""}</div>
            </div>
          </a>
          {/* user.isverified */}
          <div
            onClick={() => setOptions(true)}
            className="flex justify-center relative items-center text-3xl"
          >
            <div className="">
              <IoReorderThreeOutline />
            </div>
            <div
              className={`duration-100 absolute shadow-xl ${
                options
                  ? " w-[200px] z-40 h-auto -left-[171px] p-3 top-7 dark:text-white text-black rounded-xl bg-white dark:bg-[#4c66ad]"
                  : "w-0 h-0 p-0 top-0 right-0 z-0 "
              }`}
            >
              <div
                className={`${
                  options
                    ? "flex flex-col gap-2 font-semibold h-full  text-sm"
                    : "h-0 gap-0  text-[0px] "
                }`}
              >
                <Link
                  href={`/main/chat/${params?.id}/${params?.con}?type=hiddenMsgs`}
                >
                  Hidden Messages
                </Link>
                <Link
                  href={`/main/chat/${params?.id}/${params?.con}?type=reports`}
                >
                  Reports
                </Link>
                {canblock ? (
                  <div className="text-red-300" onClick={handleBlock}>
                    Block
                  </div>
                ) : (
                  <div className="text-red-300" onClick={handleBlock}>
                    UnBlock
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* chats  */}

        {optionType === "hiddenMsgs" && (
          <Hidden
            id={data?.id}
            user={user}
            convId={params?.con}
            socket={socket}
            data={data}
            dispatch={dispatch}
          />
        )}
        {!optionType && (
          <>
            <div
              id="scrollableDiv"
              style={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
                paddingLeft: 20,
              }}
              className={`duration-75 relative overflow-y-scroll bg-red-900 dark:bg-bluedark ${
                reply && replyId ? "h-[80%] " : "h-[84%]"
              }`}
            >
              {/*Put the scroll bar always on the bottom*/}
              <InfiniteScroll
                dataLength={messages?.length}
                next={loadmore}
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                }} //To put endMessage and loader to the top.
                inverse={true} //
                hasMore={end}
                height={"100%"}
                loader={
                  <div className="flex justify-center items-center p-3">
                    <div className="animate-spin ">
                      <LuLoader2 />
                    </div>
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {preview === false && (
                  <div>
                    {messages.map((d, i) => (
                      <PrivateChats
                        d={d}
                        ref={messageRefs.current[d.mesId]}
                        messages={messages}
                        handleScrollToMessage={handleScrollToMessage}
                        receiverId={params?.id}
                        convId={params?.con}
                        key={d.mesId}
                        socket={socket}
                        data={data}
                        dispatch={dispatch}
                        i={i}
                        user={user}
                      />
                    ))}
                  </div>
                )}

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
                      </div>
                    </div>
                  </div>
                )}
              </InfiniteScroll>
            </div>
            {/* footer  */}
            <div
              className={`bg-[#fff] duration-75 flex border-t-2 dark:bg-bluelight  bg-green-300  justify-center ${
                reply && replyId
                  ? "h-[12%] gap-2 space-y-2"
                  : "h-[8%] items-center"
              }`}
            >
              {canblock === true && isBlocked === false && (
                <div className="px-2 w-full dark:bg-bluelight   ">
                  {/* <div onClick={() => loadmore()}>Load More</div> */}

                  {reply && replyId && (
                    <div className="flex justify-between p-1 px-2 rounded-[10px] m-1 bg-red-300 items-center text-black">
                      <div    className={`${
                reply && replyId
                  ? "text-[14px]"
                  : "text-[0px]"
              }`} >{limitWords(reply, 65)}</div>
                      <div>
                        <RxCross2
                          className={`dur${
                            reply && replyId
                              ? "text-[14px]"
                              : "text-[0px]"
                          }`} 
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
                    sendMessages={sendm}
                    sendgif={sendgif}
                    senderId={data?.id}
                    sender_fullname={data?.fullname}
                    convId={params?.con}
                    recieverId={params?.id}
                    handleSend={handleSend}
                    setContent={setContent}
                    reply={replyFunc}
                    setMessages={setMessages}
                    setincommsgs={setincommsgs}
                    setMessage={setMessage}
                    setType={setType}
                    type={type}
                    socket={socket}
                    name={name}
                    content={content}
                    size={size}
                    message={msg}
                    dispatch={dispatch}
                  />
                </div>
              )}

              {canblock === false && isBlocked != true && (
                <div className="absolute bottom-0 bg-white w-full">
                  You Have Block {user?.fullname}
                </div>
              )}

              {isBlocked && canblock !== false && (
                <div>You Have Been Blocked by {user?.fullname}</div>
              )}

              {canblock === false && isBlocked && (
                <div>You Both Blocked Each other</div>
              )}
            </div>
          </>
        )}

        {/*
			<SearchBar />
			{/* <SuggestionBar /> */}
        {/* 
			<Grid width={800} columns={3} gutter={6} onGifClick={(item, e) => {
				e.preventDefault(); console.log(item, "item");

				dispatch(setType("gif"))
				dispatch(setMessage(item?.images.downsized.url))
				setUrl(item?.images.downsized.url);
			}} fetchGifs={fetchGifs} key={searchKey} /> */}
      </div>
    </>
  );
};

export default Components;
