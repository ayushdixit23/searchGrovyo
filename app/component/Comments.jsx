import { API } from "@/Essentials";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { IoSendSharp } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const Comments = ({ id, postId, setShowComments, dp, fullname }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (id && postId) {
      axios.get(`${API}/fetchallcomments/${id}/${postId}`).then((res) => {
        console.log(res.data.merged);
        setComments(res.data.merged);
      });
    }
  }, [id, postId]);

  const handleCreateComments = async () => {
    try {
      const res = await axios.post(`${API}/createcomment/${id}/${postId}`, {
        text: comment,
      });

      const obj = {
        dp,
        comments: {
          senderId: {
            _id: id,
            fullname,
          },
          text: comment,
        },
      };
      if (res.data.success) {
        setComments([obj, ...comments]);
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-[#FAFAFA] dark:bg-[#131313] p-3 rounded-2xl">
        <div className="px-3 flex justify-between items-center w-full">
          <div className="text-lg font-semibold">Comments</div>
          <div onClick={() => setShowComments(false)}>
            <RxCross1 />
          </div>
        </div>

        <div className="flex justify-between mt-4 w-full border border-[#CCCCCC] dark:border-[#333333] rounded-xl items-center">
          <div className="flex light:bg-white rounded-xl justify-center px-3 w-full items-center gap-2">
            <div className="flex  justify-center items-center w-full gap-2 ">
              <BiCommentDetail />
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment.."
                className="w-full rounded-lg placeholder:text-[#686B6E] placeholder:text-sm outline-none px-2 py-2"
              />
            </div>
            <div onClick={handleCreateComments}>
              <IoSendSharp />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-5 gap-3">
          {comments?.map((d, i) => (
            <div
              key={i}
              className={`p-5 py-6 light:shadow-sm  rounded-2xl ${
                id == d?.comments?.senderId?._id
                  ? "bg-white dark:bg-[#0D0F10]"
                  : "border border-[#DEE1E5] dark:border-[#1A1D21]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-[50px] -mt-4 h-[50px]">
                  <img
                    src={d?.dp}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="font-semibold">
                    {d?.comments?.senderId?.fullname}
                  </div>
                  <div className="text-[#9B9C9E] text-sm">
                    {d?.comments?.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Comments;
