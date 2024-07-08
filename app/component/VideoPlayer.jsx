"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaCompress, FaExpand } from "react-icons/fa6";
import {
  MdOutlineVolumeDown,
  MdOutlineVolumeUp,
  MdReplay,
  MdSettings,
  MdVolumeOff,
} from "react-icons/md";
import { GrPauseFill, GrPlayFill } from "react-icons/gr";
import { RiForward10Fill, RiReplay10Fill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsPip } from "react-icons/bs";
import { IoMdSkipForward } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa";

const VideoPlayer = ({ src, adSrc, width, height, poster }) => {
  const videoRef = useRef();
  const containerRef = useRef();
  const [isplaying, setIsplaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const speeds = [0.25, 0.5, 1, 1.25, 1.75, 2];
  const [animateButton, setAnimateButton] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [skipButtonVisible, setSkipButtonVisible] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [isAdPlayed, setIsAdPlayed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showspeed, setShowspeed] = useState(false);
  const [animation, setAnimation] = useState(false);

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef?.current?.requestFullscreen) {
        containerRef?.current?.requestFullscreen();
      } else if (containerRef?.current?.mozRequestFullScreen) {
        containerRef?.current?.mozRequestFullScreen();
      } else if (containerRef?.current?.webkitRequestFullscreen) {
        containerRef?.current?.webkitRequestFullscreen();
      } else if (containerRef?.current?.msRequestFullscreen) {
        containerRef?.current?.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document?.fullscreenElement) {
      if (document?.exitFullscreen) {
        document?.exitFullscreen();
      } else if (document?.mozCancelFullScreen) {
        document?.mozCancelFullScreen();
      } else if (document?.webkitExitFullscreen) {
        document?.webkitExitFullscreen();
      } else if (document?.msExitFullscreen) {
        document?.msExitFullscreen();
      }
    }
    setIsFullscreen(false);
  };

  const handleSpeedChange = (e, speed) => {
    e.stopPropagation();
    setShowspeed(false);

    setSelectedSpeed(speed);
    videoRef.current.playbackRate = speed;
  };

  const handleMute = () => {
    if (!isMuted) {
      videoRef.current.volume = 0;
      setVolume(0);
    } else {
      // Set the volume to the previous volume value
      videoRef.current.volume = 1;
      setVolume(1);
    }
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handlePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Error enabling PiP mode:", error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePlay = () => {
    if (showSettings) {
      setShowSettings(false);
    }

    if (isEnded) {
      setIsEnded(false);
    }

    setIsplaying(true);
    videoRef.current.play();
    triggerAnimation();
  };

  const handlePause = () => {
    if (showSettings) {
      setShowSettings(false);
    }

    setIsplaying(false);

    videoRef.current.pause();
    triggerAnimation();
  };

  const handleSkipForward = () => {
    videoRef.current.currentTime += 10;
    setAnimation("add"); // Trigger add animation
    setTimeout(() => setAnimation(null), 1000);
  };

  const handleSkipBackward = () => {
    videoRef.current.currentTime -= 10;
    setAnimation("sub"); // Trigger add animation
    setTimeout(() => setAnimation(null), 1000);
  };

  const sec2Min = (sec) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    // Format minutes and seconds with leading zeros if necessary
    const formattedMin = min < 10 ? `0${min}` : min;
    const formattedSec = secRemain < 10 ? `0${secRemain}` : secRemain;
    return {
      min: formattedMin,
      sec: formattedSec,
    };
  };
  useEffect(() => {
    const { min, sec } = sec2Min(videoRef.current?.duration);
    setDurationSec(videoRef.current?.duration);
    setDuration([min, sec]);
    const interval = setInterval(() => {
      const { min, sec } = sec2Min(videoRef.current?.currentTime);
      setCurrentTimeSec(videoRef.current?.currentTime);
      setCurrentTime([min, sec]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isplaying, isAdPlaying, isAdPlayed, videoRef]);

  const handleVideoEnd = () => {
    setIsEnded(true);
    setIsplaying(false);
  };

  useEffect(() => {
    videoRef.current.addEventListener("loadedmetadata", () => {
      const { min, sec } = sec2Min(videoRef.current?.duration);
      setDurationSec(videoRef.current?.duration);
      setDuration([min, sec]);
    });

    return () => {
      videoRef.current?.removeEventListener("loadedmetadata", () => {});
    };
  }, [videoRef]);

  const triggerAnimation = () => {
    setAnimateButton(true);
    if (!isplaying) {
      setTimeout(() => setAnimateButton(false), 500); // 300ms matches the animation durationx
    }
  };

  // const handleKeyDown = (e) => {
  // 	if (!isAdPlaying) {
  // 		if (e.keyCode === 39) {
  // 			// Right arrow key pressed
  // 			videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, durationSec);
  // 		} else if (e.keyCode === 37) {
  // 			// left arrow key pressed
  // 			videoRef.current.currentTime = Math.min(videoRef.current.currentTime - 10, durationSec);
  // 		}

  // 	}

  // 	if (e.keyCode === 32) {
  // 		// Space bar key pressed
  // 		if (isplaying) {
  // 			handlePause();
  // 		} else {
  // 			handlePlay();
  // 		}
  // 		e.preventDefault(); // Prevent default space bar action (page scrolling)
  // 	} else if (e.keyCode === 77) { // 'M' key pressed
  // 		handleMute();
  // 	} else if (e.keyCode === 70) { // 'F' key pressed
  // 		handleFullscreen();
  // 	} else if (e.keyCode === 27 && isFullscreen) { // ESC key pressed and fullscreen is active
  // 		exitFullscreen();
  // 	}
  // };

  useEffect(() => {
    if (isAdPlaying) {
      const timeoutId = setTimeout(() => {
        setSkipButtonVisible(true);
      }, 6000);

      return () => clearTimeout(timeoutId);
    } else {
      setSkipButtonVisible(false);
    }
  }, [isAdPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // useEffect(() => {
  // 	window.addEventListener('keydown', handleKeyDown);

  // 	return () => {
  // 		window.removeEventListener('keydown', handleKeyDown);
  // 	};
  // }, [durationSec, isplaying, isFullscreen, isMuted]);

  return (
    <>
      <div
        onDoubleClick={() => {
          if (!isFullscreen) {
            handleFullscreen();
          }
        }}
        ref={containerRef}
        className={`relative  cursor-pointer w-full h-full`}
      >
        <video
          ref={videoRef}
          muted={isMuted}
          src={isAdPlayed ? adSrc : src}
          // src={isAdPlayed ? src : adSrc}
          // src={src}
          poster={poster ? poster : null}
          onEnded={handleVideoEnd}
          className="w-full bg-black object-contain rounded-2xl h-full"
        />

        <div
          onDoubleClick={(e) => {
            e.preventDefault();
            const videoElement = e.currentTarget;
            const clickX =
              e.clientX - videoElement.getBoundingClientRect().left;
            const centerX = videoElement.clientWidth / 2;

            if (clickX > centerX) {
              // Clicked to the right
              videoRef.current.currentTime += 10;
              setAnimation("add"); // Trigger add animation
              setTimeout(() => setAnimation(null), 1000);
            } else {
              // Clicked to the left
              videoRef.current.currentTime -= 10;
              setAnimation("sub"); // Trigger add animation
              setTimeout(() => setAnimation(null), 1000);
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            isplaying ? handlePause() : handlePlay();
          }}
          className="absolute w-full bg-bk h-full rounded-2xl inset-0"
        >
          {animation && (
            <div
              className={`flex absolute z-0 w-full h-full justify-center items-center ${
                animation === "add" ? "text-green-500" : "text-red-500"
              } `}
            >
              {animation === "add" ? (
                <div className="flex  w-[50%] justify-end  text-xl items-center gap-2">
                  +10s
                </div>
              ) : (
                <div className="flex w-[50%] text-xl items-center gap-2">
                  -10s
                </div>
              )}
            </div>
          )}

          {animateButton && (
            <div className="flex absolute z-0 w-full h-full justify-center items-center">
              {isplaying ? (
                <div className="flex items-center justify-center  w-full h-full">
                  <button
                    onClick={handlePause}
                    className="text-white  popup-animation w-[70px] h-[70px] rounded-full flex justify-center items-center bg-transparent text-xl"
                  >
                    <GrPauseFill className="text-white text-xl" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center  w-full h-full">
                  <button
                    onClick={handlePlay}
                    className="text-white popup-animation w-[70px] h-[70px] rounded-full flex justify-center items-center bg-transparent "
                  >
                    <GrPlayFill className="text-white text-xl" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="relative w-full h-full ">
            {isAdPlaying && (
              <div className="absolute flex flex-col justify-end w-full p-2 px-4 h-full bottom-14 left-0">
                <div className="flex justify-end  items-end">
                  {skipButtonVisible && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAdPlaying(false);
                        setTimeout(() => {
                          videoRef.current.play(); // Trigger play after a short delay
                        }, 100); //
                      }}
                      className="bg-black z-10 flex justify-center text-sm items-center gap-1 text-white p-2 rounded-lg font-semibold"
                    >
                      Skip
                      <IoMdSkipForward />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="absolute flex flex-col justify-end w-full p-2 px-4 h-full left-0">
              <div className=" flex flex-col justify-end items-end  w-full text-white z-10 ">
                {/* {isFullscreen && <div className="text-sm font-medium py-2">
									{currentTime[0]}:{currentTime[1]} / {duration[0]}:
									{duration[1]}
								</div>} */}
                {isFullscreen && (
                  <div className="relative w-full h-[3px] bg-white rounded-lg ">
                    <input
                      type="range"
                      min="0"
                      disabled={isAdPlaying}
                      max={durationSec}
                      value={currentTimeSec}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (!isAdPlaying) {
                          videoRef.current.currentTime = e.target.value;
                        }
                      }}
                    />
                    <div
                      className={`absolute top-0 left-0 w-full h-full ${
                        isAdPlaying ? "bg-[#d2ad3e]" : "bg-blue-700"
                      } `}
                      style={{
                        width: `${(currentTimeSec / durationSec) * 100}%`,
                      }}
                    ></div>
                    <div
                      className={`absolute top-1/2 transform -translate-y-1/2 w-[11px] z-30 h-[11px]  ${
                        isAdPlaying ? "bg-[#d2ad3e]" : "bg-blue-700"
                      } rounded-full`}
                      style={{
                        left: `${(currentTimeSec / durationSec) * 100}%`,
                        marginLeft: "-3px",
                      }}
                    ></div>
                  </div>
                )}
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="mt-1 flex justify-between w-full z-20 items-center"
              >
                {isFullscreen && (
                  <div className="flex w-full gap-3 items-center">
                    <div>
                      {isEnded ? (
                        <div className="flex items-center h-full">
                          <button onClick={handlePlay} className="">
                            <MdReplay className="text-white  text-xl" />
                          </button>
                        </div>
                      ) : isplaying ? (
                        <div className="flex items-center h-full">
                          <button onClick={handlePause} className="">
                            <GrPauseFill className="text-white  text-xl" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center h-full">
                          <button
                            onClick={handlePlay}
                            className="text-white  text-xl"
                          >
                            <GrPlayFill className="text-white " />
                          </button>
                        </div>
                      )}
                    </div>
                    {/* <div className="group flex justify-center items-center gap-2">
											{isMuted ? (
												<GoMute className="text-white " onClick={handleMute} />
											) : volume < 0.5 ? (
												<button onClick={handleMute} className="">
													<MdOutlineVolumeDown className="text-white " />
												</button>
											) : (
												<button onClick={handleMute} className="">
													<MdOutlineVolumeUp className="text-white " />
												</button>
											)}

											<div className="hidden group-hover:block">
												<input
													type="range"
													min="0"
													max="1"
													step="0.1"
													value={volume}
													onChange={handleVolumeChange}
													className="h-[4px] w-full flex justify-center items-center "
												/>
											</div>
										</div> */}

                    {isFullscreen && (
                      <div className="flex justify-center  items-center gap-3">
                        <div onClick={handleSkipBackward}>
                          <RiReplay10Fill className="text-white text-xl" />
                        </div>
                        <div onClick={handleSkipForward}>
                          <RiForward10Fill className="text-white text-xl" />
                        </div>
                      </div>
                    )}
                    {isFullscreen && (
                      <div className="text-sm text-white  py-2">
                        {currentTime[0]}:{currentTime[1]} / {duration[0]}:
                        {duration[1]}
                      </div>
                    )}
                    {/* <div className="flex justify-center items-center gap-2">
											<div onClick={handleSkipBackward}>
												<RiReplay10Fill className="text-white " />
											</div>
											<div onClick={handleSkipForward}>
												<RiForward10Fill className="text-white " />
											</div>
										</div> */}
                  </div>
                )}
                <div className="w-full">
                  <div
                    className={`flex w-full ${
                      isFullscreen
                        ? " gap-5 justify-end items-center"
                        : "  justify-end items-end"
                    } `}
                  >
                    {/* <div className="z-20 flex justify-center items-center gap-2">
												{
													speeds.map((d, i) =>
													(
														<div onClick={(e) => { e.stopPropagation(); handleSpeedChange(d) }} key={i} className=" text-white text-sm">{d} x</div>
													)
													)
												}</div> */}
                    {isFullscreen && (
                      <div className="group flex justify-center items-center gap-2">
                        {isMuted || volume === 0 ? (
                          <button onClick={handleMute}>
                            <MdVolumeOff className="text-white  text-xl " />
                          </button>
                        ) : volume < 0.5 ? (
                          <button onClick={handleMute} className="">
                            <MdOutlineVolumeDown className="text-white  text-xl " />
                          </button>
                        ) : (
                          <button onClick={handleMute} className="">
                            <MdOutlineVolumeUp className="text-white  text-xl " />
                          </button>
                        )}
                        <div
                          id="volume-control-container"
                          className="hidden group-hover:block w-24"
                        >
                          <input
                            type="range"
                            min="0"
                            id="volume-control"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="h-[4px] w-full bg-white text-white flex justify-center items-center"
                          />
                        </div>
                      </div>
                    )}
                    {isFullscreen && (
                      <div
                        onClick={(e) => {
                          setShowSettings(!showSettings);
                        }}
                        className="relative text-white"
                      >
                        <MdSettings
                          className={`text-[22px] ${
                            showSettings
                              ? "rotate-45 duration-500 transition"
                              : "-rotate-45 duration-500 transition"
                          }`}
                        />

                        {showSettings && (
                          <div
                            className={`absolute bottom-[28px]  min-w-[130px] w-auto h-auto bg-[#000]/90 rounded-sm z-40 transition-all -left-[30px] duration-500 ${
                              showSettings
                                ? "scale-100 opacity-100"
                                : "scale-75 opacity-0 pointer-events-none"
                            }`}
                            style={{
                              transformOrigin: "bottom center",
                            }}
                          >
                            <div className="flex text-xs p-3 justify-center w-full items-center">
                              {!showspeed && (
                                <div
                                  className="flex justify-between items-center w-full
														"
                                >
                                  <div>Speed</div>

                                  <div className="flex justify-center items-center gap-2">
                                    <div>{selectedSpeed}x</div>
                                    <BsChevronRight
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowspeed(true);
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {showspeed && (
                                <div className="flex flex-col items-start w-full justify-normal gap-4">
                                  <div className="flex justify-start items-center gap-1">
                                    <div>
                                      <BsChevronLeft
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowspeed(false);
                                        }}
                                      />
                                    </div>
                                    <div className="text-[12px]">Speed</div>
                                  </div>
                                  {speeds.map((speed) => (
                                    <button
                                      key={speed}
                                      onClick={(e) =>
                                        handleSpeedChange(e, speed)
                                      }
                                      className={` ${
                                        selectedSpeed === speed
                                          ? "selected"
                                          : ""
                                      }`}
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {isFullscreen && (
                      <button onClick={handlePiP} className="z-10 ">
                        <BsPip className="text-white text-xl" />
                      </button>
                    )}

                    {isFullscreen ? (
                      <button onClick={handleFullscreen} className="z-10 ">
                        {isFullscreen ? (
                          <FaCompress className="text-white text-xl" />
                        ) : (
                          <FaExpand className="text-white text-xl" />
                        )}
                      </button>
                    ) : (
                      <>
                        {isplaying && (
                          <button onClick={handleFullscreen} className="z-10 ">
                            {isFullscreen ? (
                              <FaCompress className="text-white text-xl" />
                            ) : (
                              <FaExpand className="text-white text-xl" />
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
