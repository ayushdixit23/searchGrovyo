import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import wait from "../../assets/Images/wait.png";

function Community(props) {
  const [community, setCommunity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let a = [1, 2, 3, 4, 5, 6, 7, 8]
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(2)

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const itemWidth = scrollContainerRef.current.children[currentIndex]?.offsetWidth;
      scrollContainerRef.current.scrollLeft = (itemWidth * currentIndex) - (scrollWidth / 2) + (itemWidth / 2);
    }
  }, [currentIndex]);

  useEffect(() => {
    setTimeout(() => {
      if (a.length === currentIndex) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    }, 1000)
  }, [currentIndex])


  useEffect(() => {
    if (props.coms) {
      setCommunity(props.coms);
      setIsLoading(false); // Set loading to false once data is loaded
    }
  }, [props.coms]);

  return (
    <>
      {community.length > 0 && (

        <div className="flex flex-wrap justify-center items-center w-full sm:w-[93%] flex-col gap-10 px-6">
          {
            community.map((d, i) => (
              <>
                <div className="flex w-full gap-10 flex-col  sm:flex-row justify-center items-center">
                  <div
                    className="flex flex-col flex-grow h-[300px] pp:w-[400px] w-full bg-[#fefefe] dark:bg-bluedark dark:text-white border-[1px] md:max-lg:w-[400px] hover:shadow-md hover:border-0 duration-75 px-3 border-[#f5f5f5] rounded-3xl py-3"
                    key={i}
                  >
                    <div className="h-[75px] w-[75px] bg-[#f9f9f9] rounded-[34px] shadow-md ring-1 ring-white">
                      <img
                        src={d?.dps}
                        alt="img"
                        className="h-[75px] w-[75px] rounded-[34px] ring-1 ring-white shadow-md"
                        width={100}
                      />
                    </div>
                    <div className="text-xl mt-2 font-semibold">
                      {d?.title}
                    </div>

                    <div>{d?.desc.length > 90 ? `${d?.desc.slice(0, 90)}...` : d?.desc}</div>
                    <div className="flex justify-end items-end h-full">
                      <a href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en&gl=US" className="text-white rounded-2xl hover:bg-black hover:scale-105 duration-100 flex items-center justify-center bg-[#1a1a1a] w-[100%] p-[10px]">
                        View
                      </a>
                    </div>

                  </div>

                  <div


                    // ref={i === 0 ? scrollContainerRef : null}
                    ref={scrollContainerRef}
                    className="w-full sm:px-7 overflow-x-scroll sm:justify-start justify-center items-center no-scrollbar flex gap-6">
                    {
                      d?.communityWithPosts.map((f, j) => (
                        <div key={j} className="flex flex-col gap-2 w-full min-w-full pp:max-w-[400px] pp:min-w-[250px] justify-center ">
                          <div className="h-[250px] rounded-xl ">
                            {f?.type.startsWith("image")
                              ? <img src={f?.dp} className=" h-full w-full min-w-full pp:min-w-[250px] rounded-xl" /> :
                              <video src={f?.dp} controls className=" h-full w-full min-w-full pp:min-w-[250px] rounded-xl" />
                            }


                          </div>
                          <div className="max-w-[220px] font-semibold text-sm">{f?.title.length > 40 ? `${f?.title.slice(0, 40)}...` : f?.title}</div>
                        </div>
                      ))
                    }
                  </div>
                </div >
              </>
            ))
          }

        </div >
      )
      }
    </>
  );
}

export default Community;
