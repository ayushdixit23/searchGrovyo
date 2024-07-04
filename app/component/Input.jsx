import React, { useContext, useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import { MdGifBox, MdOutlineEmojiEmotions } from "react-icons/md";
import camera from "../assets/camera.png";
import video from "../assets/video.png";
import documentpic from "../assets/document.png";
import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
  SuggestionBar,
} from "@giphy/react-components";
import { setPreview } from "../redux/slice/remember";
import EmojiPicker from "emoji-picker-react";
import { socketemitfunc } from "../utils/SocketWrapper";
import Image from "next/image";
import { useTheme } from "next-themes";

const Input = ({
  sendMessages,
  sendgif,
  setincommsgs,
  handleSend,
  image = null,
  senderId,
  reply,
  convId,
  recieverId,
  sender_fullname,
  type,
  name,
  content,
  size,
  socket,
  message,
  setContent,
  setMessage,
  setType,
  dispatch,
}) => (
  <SearchContextManager apiKey={"BhiAZ1DOyIHjZlGxrtP2NozVsmpJ27Kz"}>
    <Component
      sendMessages={sendMessages}
      setincommsgs={setincommsgs}
      image={image}
      reply={reply}
      sendgif={sendgif}
      handleSend={handleSend}
      senderId={senderId}
      socket={socket}
      convId={convId}
      recieverId={recieverId}
      sender_fullname={sender_fullname}
      type={type}
      name={name}
      content={content}
      size={size}
      message={message}
      setContent={setContent}
      setMessage={setMessage}
      setType={setType}
      dispatch={dispatch}
    />
  </SearchContextManager>
);

const Component = ({
  sendMessages,
  sendgif,
  image,
  setincommsgs,
  socket,
  handleSend,
  reply,
  senderId,
  convId,
  recieverId,
  sender_fullname,
  type,
  name,
  content,
  size,
  message,
  setContent,
  setMessage,
  setType,
  dispatch,
}) => {
  // const [message, setMessage] = useState("");
  const [d, setD] = useState("");
  const [showgif, setShowgif] = useState(false);
  const [show, setShow] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emoji, setEmoji] = useState("");
  const { theme } = useTheme();
  const { fetchGifs, searchKey } = useContext(SearchContext);

  const mainSendingFunction = () => {
    try {
      const rid = Math.floor(Math.random() * 90000000) + 10000000;
      const timer = moment(new Date()).format("HH:mm").toString();
      const timestamp = `${new Date()}`;
      const mess = {
        sender_fullname: sender_fullname,
        sender_id: senderId,
        text: message,
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
        convId: convId,
        reciever: recieverId,
        isread: false,
        //      sequence: data.length + 1,
        sender: { fullname: sender_fullname, _id: senderId },
        content: { content, name, size },
        url: content
          ? typeof content === "string"
            ? content
            : URL.createObjectURL(content)
          : null,
        status: "active",
        readby: [],
        dp: image,
      };

      if (type == "text" || !type) {
        console.log("runde");
        sendMessages(rid);
        if (message.length > 0) {
          dispatch(setincommsgs(mess));
        }
      } else if (type == "gif") {
        sendgif(content, rid);
      }
      if (type == "image" || type == "video" || type == "doc") {
        handleSend(rid);
        dispatch(setincommsgs(mess));
      } else if (type === "reply") {
        reply(rid);
      }
      dispatch(setMessage(""));
      dispatch(setContent(""));
      dispatch(setPreview(false));
      dispatch(setType("text"));
      setD("");

      console.log(mess);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      mainSendingFunction();
    }

    if (e.key === "Backspace") {
      if (!message) return;

      const cursorPosition = e.target.selectionStart;
      const value = e.target.value;

      if (cursorPosition > 0) {
        // Get the character before the cursor
        const charBeforeCursor = value[cursorPosition - 1];

        // Emoji regex including surrogate pairs
        const emojiRegex =
          /([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83D[\uDC00-\uDDFF])/g;

        // Check if the character before the cursor is an emoji
        const matchedEmojis = value.slice(0, cursorPosition).match(emojiRegex);

        if (matchedEmojis) {
          const lastEmoji = matchedEmojis[matchedEmojis.length - 1];
          const lastEmojiIndex = value
            .slice(0, cursorPosition)
            .lastIndexOf(lastEmoji);

          const newMessage =
            value.slice(0, lastEmojiIndex) + value.slice(cursorPosition);
          dispatch(setMessage(newMessage));
        } else {
          const newMessage =
            value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
          dispatch(setMessage(newMessage));
        }

        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("Key pressed:", event.key);
      socketemitfunc({
        event: "typing",
        data: {
          userId: senderId,
          id: recieverId,
          roomId: convId,
          status: true,
        },
        socket,
      });
    };

    // Attach the event listeners
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listeners on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [socket]);

  return (
    <>
      {showEmoji && (
        <div
          className={` duration-75 z-0 ${
            showEmoji === false
              ? "w-full left-0 absolute bottom-0 h-0"
              : "w-full left-0 absolute bottom-[8%] "
          }`}
        >
          <EmojiPicker
            width={"100%"}
            allowExpandReactions={true}
            disableAutoFocus={true}
            theme={theme}
            reactionsDefaultOpen={true}
            onEmojiClick={(emo) => {
              setEmoji((emoji) => emoji + emo.emoji);
              if (message) {
                const mes = message + emo.emoji;
                dispatch(setMessage(mes));
                emo = "";
              } else {
                dispatch(setMessage(emo.emoji));
                emo = "";
              }
            }}
          />
        </div>
      )}

      <div
        className={`duration-75 ${
          showgif === true
            ? "h-[60vh] bg-[#e4e4e4] p-2 gap-2 w-full right-0 absolute bottom-[8vh] overflow-y-scroll no-scrollbar"
            : "h-[0vh] bg-[#e4e4e4] p-0 gap-0 w-full right-0 absolute bottom-0 overflow-y-scroll no-scrollbar"
        }`}
      >
        <div>
          <SearchBar />
        </div>
        <div>
          <SuggestionBar />
        </div>
        <div>
          <Grid
            gutter={6}
            onGifClick={(item, e) => {
              e.preventDefault();
              console.log(item, "item");
              dispatch(setPreview(true));
              setShow(false);
              setShowgif(false);
              dispatch(
                setContent({
                  content: item?.images.downsized.url,
                })
              );
              dispatch(setType("gif"));
            }}
            fetchGifs={fetchGifs}
            key={searchKey}
          />
        </div>
      </div>

      <div className="bg-grey-lighter  flex h-full z-20 items-center">
        <div className=" flex justify-center gap-2 items-center">
          {showEmoji ? (
            <RxCross2
              className="text-2xl"
              onClick={() => setShowEmoji(false)}
            />
          ) : (
            <MdOutlineEmojiEmotions
              className="text-2xl"
              onClick={() => setShowEmoji(true)}
            />
          )}

          <RxCross2
            className={`text-2xl duration-100 ${
              show
                ? "rotate-0 bg-[#1717177a] p-1 rounded-xl"
                : "rotate-[45deg] "
            }`} // Adjust rotation based on show state
            onClick={() => setShow((prevShow) => !prevShow)} // Toggle show state
          />

          <div
            className={` ${
              show
                ? "absolute left-5  z-40 bottom-12 rounded-[12px]"
                : " -z-10 absolute left-0 bottom-0 rounded-[0px] "
            } `}
          >
            <div
              className={`duration-75  ${
                show === true
                  ? "flex flex-col min-w-[150px] px-3 bg-white shadow-md dark:bg-[#0D0F10] dark:shadow-custom-lg rounded-[12px] gap-1 p-1 items-center h-full"
                  : "gap-0 py-0 h-0"
              }`}
            >
              {/* image  */}
              <label className="w-full" htmlFor="image">
                <div className="flex w-full  justify-start items-center py-2 duration-75 rounded-xl ">
                  <div>
                    <input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files && e.target.files[0];
                        if (selectedFile) {
                          dispatch(setType("image"));
                          setShow(false);
                          dispatch(
                            setContent({
                              content: e.target.files[0],
                              name: selectedFile.name,
                              size: selectedFile.size,
                            })
                          );
                          dispatch(setPreview(true));
                        }
                        console.log(message);
                      }}
                      className="hidden"
                    />

                    {/* <TfiImage
                      className={`duration-75 ${
                        show === true ? "w-[30px] h-[30px]" : "h-[0px] w-[0px]"
                      }`}
                    /> */}
                    <Image
                      src={camera}
                      className={`duration-75 ${
                        show === true ? "w-[22px] h-[20px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </div>
                  <div
                    className={`duration-75 ${
                      show === true
                        ? "w-auto text-start font-medium  text-sm pl-2"
                        : "w-[0px] text-[0px] pl-0"
                    }`}
                  >
                    Image
                  </div>
                </div>
              </label>
              {/* video  */}
              <label
                htmlFor="video"
                className="flex w-full justify-start items-center py-2 duration-75 rounded-xl "
              >
                <div>
                  <input
                    id="video"
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files && e.target.files[0];
                      if (selectedFile) {
                        setShow(false);
                        dispatch(setType("video"));
                        dispatch(
                          setContent({
                            content: e.target.files[0],
                            name: selectedFile.name,
                            size: selectedFile.size,
                          })
                        );
                        dispatch(setPreview(true));
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="video">
                    <Image
                      src={video}
                      className={`duration-75 ${
                        show === true ? "w-[22px] h-[20px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </label>
                </div>
                <div
                  className={`duration-75 ${
                    show === true
                      ? "w-auto text-start font-medium  text-sm pl-2"
                      : "w-[0px] text-[0px] pl-0"
                  }`}
                >
                  Video
                </div>
              </label>

              {/* document  */}
              <div className="flex items-center justify-start w-full py-2 duration-75 rounded-xl ">
                <div className="">
                  <input
                    id="document"
                    type="file"
                    name="document"
                    accept=".pdf, .zip"
                    onChange={(e) => {
                      const selectedFile = e.target.files && e.target.files[0];
                      if (selectedFile) {
                        setShow(false);
                        dispatch(setType("doc"));
                        dispatch(setPreview(true));
                        dispatch(
                          setContent({
                            content: e.target.files[0],
                            name: selectedFile.name,
                            size: selectedFile.size,
                          })
                        );
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="document">
                    {/* <IoDocumentSharp
                      className={`duration-75 ${
                        show === true ? "w-[30px] h-[30px]" : "h-[0px] w-[0px]"
                      }`}
                    /> */}
                    <Image
                      src={documentpic}
                      className={`duration-75 ${
                        show === true ? "w-[22px] h-[20px]" : "h-[0px] w-[0px]"
                      }`}
                    />
                  </label>
                </div>
                <label
                  htmlFor="document"
                  className={`duration-75 ${
                    show === true
                      ? "w-auto text-start font-medium text-sm pl-2"
                      : "w-[0px] text-[0px] pl-0"
                  }`}
                >
                  Document
                </label>
              </div>
              {/* gif  */}
              <div
                onClick={() => {
                  setShow(false);
                  setShowgif(true);
                }}
                className="flex items-center justify-start w-full py-2 duration-75 rounded-xl"
              >
                <MdGifBox
                  className={`duration-75 text-[#686B6E] ${
                    show === true ? "w-[20px] h-[20px]" : "h-[0px] w-[0px]"
                  }`}
                />
                {/* <Image /> */}
                <div
                  className={`duration-75 ${
                    show === true
                      ? "w-auto  font-medium text-sm text-start pl-2"
                      : "w-[0px] text-[0px] pl-0"
                  }`}
                >
                  GIF
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 mx-2 border border-[#DEE1E5] dark:border-[#1A1D21] rounded-lg">
          {!d ? (
            <input
              placeholder="Type your message here..."
              value={message}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                dispatch(setMessage(e.target.value));
                if (!content && type !== "reply") {
                  dispatch(setType("text"));
                }
              }}
              className="w-full  dark:bg-[#0D0F10] rounded-lg placeholder:text-[#686B6E] placeholder:text-sm outline-none px-2 py-2"
              type="text"
            />
          ) : (
            <div className="flex justify-between items-center w-full">
              <div>{d}</div>
              <div
                onClick={() => {
                  setD("");
                  setMessage("");
                }}
                className="text-xl"
              >
                <RxCross2 />
              </div>
            </div>
          )}
        </div>
        <div
          onClick={() => {
            mainSendingFunction();
          }}
          className="dark:bg-[#1A1D21] bg-[#686B6E] h-full p-2 rounded-xl"
        >
          <IoSend className="text-xl text-white" />
        </div>
      </div>
    </>
  );
};

export default Input;
