import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";

const Convs = ({ d, handleMuting, removingchat, href, handleVisible }) => {
  const [show, setShow] = useState(false);
  const [popupPosition, setPopupPosition] = useState("bottom");

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
    if (!show) {
      setPopupPosition("bottom"); // Reset popup position when show is false
    }
  }, [show]);

  return (
    <>
      {/* {console.log(d, "ushj")} */}
      <div
        onClick={() => setShow(false)}
        className={` fixed inset-0 ${
          show ? "z-40" : "-z-20"
        }  w-screen h-screen`}
      ></div>
      <div className="w-[100%]  gap-2 px-2 duration-200 hover:bg-slate-100 hover:dark:bg-[#191B1C] flex flex-row justify-between items-center ">
        <Link
          onClick={handleVisible}
          href={href}
          className=" gap-3 py-3 sm:py-2 w-full flex flex-row justify-start items-center "
        >
          <div className="h-[40px] w-[40px]  sm:h-[45px] sm:w-[45px]">
            <img
              src={d?.pic}
              className="h-full w-full object-cover rounded-[17px] ring-1 dark:ring-[#273142] ring-white bg-white dark:bg-bluedark "
            />
          </div>
          <div className="flex flex-col ">
            <div className="text-[15px] pb-1 font-semibold">{d?.fullname}</div>
            {d?.msgs[0]?.typ === "message" && (
              <div className="text-[14px] ">
                {d?.msgs[0]?.text.length > 30
                  ? `${d?.msgs[0]?.text.slice(0, 15)}..`
                  : d?.msgs[0]?.text}
              </div>
            )}
            {d?.msgs[0]?.typ === "image" && (
              <div className="text-sm">Image</div>
            )}
            {d?.msgs[0]?.typ === "video" && (
              <div className="text-sm">Video</div>
            )}
            {d?.msgs[0]?.typ === "doc" && (
              <div className="text-sm">Document</div>
            )}
            {d?.msgs[0]?.typ === "glimpse" && (
              <div className="text-sm">Glimpse</div>
            )}
            {d?.msgs[0]?.typ === "reply" && (
              <div className="text-[14px]">
                {d?.msgs[0]?.text.length > 30
                  ? `${d?.msgs[0]?.text.slice(0, 15)}..`
                  : d?.msgs[0]?.text}
              </div>
            )}
            {d?.msgs[0]?.typ === "post" && <div className="text-sm">Post</div>}
            {d?.msgs[0]?.typ === "gif" && <div className="text-sm">Gif</div>}
            {d?.msgs[0]?.typ === "product" && (
              <div className="text-sm">Product</div>
            )}
          </div>
        </Link>
        <div className="flex relative justify-center  items-center ">
          {d?.unread != "0" && (
            <div className="w-4 h-4 p-1 text-[8px] bg-[#3392FF] text-white flex justify-center items-center rounded-full">
              {d?.unread}
            </div>
          )}

          {/* <div className="relative left-2">
            <CiMenuKebab onClick={() => setShow(true)} />

            <div
              className={`absolute  duration-100 bg-white dark:text-white dark:bg-bluedark ${
                show
                  ? "top-2 w-auto h-auto text-sm -left-[65px]"
                  : "w-0 h-0 left-0 top-0 text-[0px]"
              } text-white py-3 rounded-xl z-40`}
            >
              <div className="flex gap-1 flex-col ">
                <div className="hover:bg-[#555]  mb-2 px-3">
                  {d?.ismuted ? (
                    <div onClick={() => handleMuting(d?.convid)}>UnMute</div>
                  ) : (
                    <div onClick={() => handleMuting(d?.convid)}>Mute</div>
                  )}
                </div>
                <div
                  className="hover:bg-[#555]   px-3"
                  onClick={() => removingchat(d?.convid)}
                >
                  Delete
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="w-[100%] border-b-[0.5px] dark:border-[#1B1B1B]"></div>
    </>
  );
};

export default Convs;

{
  /* <div
            ref={iconRef}
            onClick={() => {
              setShow(true);
            }}
            className={`relative group-hover:absolute hidden bg-transparent rounded-2xl group-hover:block group-hover:shadow-2xl shadow-black top-2 right-0`}
          >
            <CiMenuKebab onClick={() => setShow(true)} />
          </div>
          <div
            className={`${
              popupPosition === "top" ? "bottom-0" : "top-4" // Dynamically set position based on popupPosition state
            } absolute z-40  shadow-2xl  text-black  duration-100
                      ${
                        show
                          ? "rounded-[15px] bg-white shadow-2xl  py-2 w-[80px] h-[110px]"
                          : "rounded-[0px] bg-white shadow-0 py-0 w-[0px] h-[0px]"
                      } `}
          >
            {d?.ismuted ? (
              <div onClick={() => handleMuting(d?.convid)}>UnMute</div>
            ) : (
              <div onClick={() => handleMuting(d?.convid)}>Mute</div>
            )}
            <div
              className="hover:bg-[#555]   px-3"
              onClick={() => removingchat(d?.convid)}
            >
              Delete
            </div>
          </div> */
}
