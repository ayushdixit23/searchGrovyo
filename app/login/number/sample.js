"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { auth, database } from "../../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ref, set, onValue, remove } from "firebase/database";
import axios from "axios";
import Link from "next/link";
import { API } from "../../../Essentials";
import { CgSpinner } from "react-icons/cg";
import Cookies from "js-cookie";
import { useAuthContext } from "../../utils/AuthWrapper";
import { QRCodeSVG } from "qrcode.react";
import { RiLoader4Line } from "react-icons/ri";
import { decryptaes } from "@/app/utils/useful";

function page() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = Array.from({ length: 6 }, () => React.createRef());
  const otpElementRef = useRef(null);
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [OTP, setOTP] = useState();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [come, setCome] = useState(0);
  const { f } = useAuthContext();
  const [change, setChange] = useState(1);
  const [email, setEmail] = useState("memerdevgamer23@gmail.com");
  const [pass, setPass] = useState("12345678");
  const [load, setLoad] = useState(false);
  const [loadingqr, setLoadingqr] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState("");
  const newRandomString = generateRandomString(17);
  const starCountRef = ref(database, `/qr/`);
  const strignref = useRef(null);

  function generateRandomString(length) {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return randomString;
  }

  const writeUserData = useCallback(async (newRandomString) => {
    set(ref(database, `/qr/${newRandomString}/`), { data: "null" });
  }, []);

  const updateRandomString = useCallback(() => {
    strignref.current = newRandomString;
    setQRCodeValue(newRandomString);
    writeUserData(newRandomString);
  }, []);

  useEffect(() => {
    updateRandomString();
    const unsub = onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      if (
        strignref?.current &&
        data[strignref?.current]?.data !== "null" &&
        loading === false
      ) {
        const fd = decryptaes(data[strignref?.current]?.data);

        setLoadingqr(true);
        if (fd) {
          const dataforSend = JSON.parse(fd);

          const res = await axios.post(`${API}/webcheckqr`, {
            id: dataforSend?.id,
          });
          if (res.data?.success) {
            setTimeout(async () => {
              await cookiesSetter(res);
              setTimeout(() => {
                const reref = ref(database, `/qr/${strignref?.current}/`);
                remove(reref)
                  .then(() => {
                    setLoadingqr(false);
                  })
                  .catch((error) => {
                    console.error("Error deleting data:", error.message);
                  });
              }, 1000);
            }, 2000);
          }
        }
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const handleInputChange = (event, index) => {
    const { value } = event.target;
    setOtp((prevOTP) => {
      const newOTP = [...prevOTP];
      newOTP[index] = value;
      return newOTP;
    });

    if (value === "" && index > 0) {
      otpInputRefs[index - 1].current.focus();
    } else if (value !== "" && index < 5) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  useEffect(() => {
    const finalOTP = otp.join("");
    setOTP(finalOTP);
    const otpElement = otpElementRef.current;

    if (otpElement) {
      otpElement.innerText = finalOTP;

      if (finalOTP.length === 6) {
        otpElement.classList.replace("_notok", "_ok");
      } else {
        otpElement.classList.replace("_ok", "_notok");
      }
    }
  }, [otp]);

  useEffect(() => {
    let interval;

    if (seconds === 0) {
      setSeconds(0);
      setIsActive(true);
      setCome(come + 1);
    }
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      if (seconds === 0) {
        setSeconds(0);
        setCome(1);
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    onSignup();
    setSeconds(30);
    //setIsActive(!isActive);
  };

  const cookiesSetter = async (res) => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      Cookies.set("access_token", res.data.access_token, {
        expires: expirationDate,
      });
      Cookies.set("refresh_token", res.data.refresh_token, {
        expires: expirationDate,
      });

      const token = Cookies.get("access_token");

      await f(token);
      toast.success("Login Successfull!");
      router.push("/main/feed/newForYou");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchid = async () => {
    await axios
      .post(`${API}/webapplogin`, { phone: "91" + number })
      .then(async function (res) {
        if (res.data.success === true) {
          if (res.data.userexists) {
            await cookiesSetter(res);
          } else {
            toast.error("Seems like you don't have an account in the app.");
            router.push(`/login/singUp?no=${number}`);
          }
        } else {
          toast.error("Something went wrong...");
        }
      })
      .catch(function (error) {
        console.log(error, "fetchid");
        toast.error("Something went wrong...");
      });
  };

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {
            // Response expired. Ask the user to solve reCAPTCHA again.
            // ...
          },
        }
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchaVerify();
    setSeconds(30);
    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+91" + number;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("Successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(OTP)
      .then(async (res) => {
        setLoading(false);
        fetchid();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }
  const handleCreate = async () => {
    setLoad(true);

    try {
      const res = await axios.post(`${API}/webcheckemail`, {
        email,
        password: pass,
        // loc,
        // device,
        // contacts: contactList,
        // type: "login",
        // time: `${Date.now()}`,
        // token,
      });
      if (res.data.success) {
        if (res.data.userexists) {
          await cookiesSetter(res);
        } else {
          toast.apply("Seems like you don't have an account in the app.");
          router.push("../login/singUp");
        }
      } else {
        toast.error("Wrong Details");
      }
    } catch (e) {
      console.log(e);
      setLoad(false);
    }
    setLoad(false);
  };

  return (
    <div>
      <div
        className={`${loadingqr
          ? "fixed inset-0 w-screen z-50 bg-black/60 h-screen flex justify-center items-center backdrop-blur-md"
          : "hidden -z-50"
          } `}
      >
        <div className="animate-spin">
          <RiLoader4Line className="text-3xl" />
        </div>
      </div>
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      {showOTP ? (
        // OTP
        <div className="items-center flex flex-col justify-between">
          <div className="font-bold  pn:max-sm:text-[30px] text-[25px] text-[#313C58] ">
            Verification
          </div>
          <div className="flex flex-col py-2 justify-center items-center">
            <div className="text-[#96A0AD] text-[15px] pn:max-sm:text-[12px] ">
              We’re sending an SMS to phone number
            </div>
            <div className="text-[#96A0AD] pn:max-sm:text-[12px] text-[15px] ">
              <span className="text-[#0075FF]">+91{number}</span> Wrong Number ?
            </div>
          </div>

          <>
            <div className="mx-auto max-w-md w-full flex justify-center gap-2 p-10">
              {otp.map((value, index) => (
                <>
                  <input
                    key={`otp-field-${index}`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        onOTPVerify();
                      }
                    }}
                    className="otp__digit otp__field pn:max-md:hidden outline-slate-200 bg-slate-100 h-[50px] w-[50px] rounded-2xl flex justify-center items-center text-center text-[#3e3e3e]"
                    value={value}
                    onChange={(event) => handleInputChange(event, index)}
                    ref={otpInputRefs[index]}
                    maxLength="1"
                  />
                </>
              ))}
            </div>
          </>
          <div className="text-black font-semibold flex text-[15px] pt-8">
            <div className="text-center">
              {come === 1 ? (
                <div className="space-x-4 flex ">
                  <div className="text-[#3e3e3e]">
                    Don't receive code ?{" "}
                    <button
                      className={` text-blue-600 rounded ${isActive ? "" : ""}`}
                      onClick={toggleTimer}
                    >
                      Request Again
                    </button>
                  </div>
                </div>
              ) : (
                <h1
                  className={`${come === 1 ? "hidden" : "text-[16px] text-[#3e3e3e]"
                    }`}
                >
                  Resend: 00:{seconds}
                </h1>
              )}
            </div>
          </div>
          <div
            onClick={onOTPVerify}
            className="h-[50px] w-[250px] select-none cursor-pointer bg-black mt-8 flex items-center justify-center rounded-2xl text-white"
          >
            {loading && <CgSpinner size={20} className="m-1 animate-spin" />}
            <span className={`${loading ? "hidden" : ""}`}>Continue</span>
          </div>
        </div>
      ) : (
        // Phone
        <div className="  flex flex-col justify-between items-center">
          <div className="mb-5 flex gap-3 pn:max-sm:hidden justify-center   items-center flex-col">
            <div className="relative bg-white border-2 border-[#f3f3f3] dark:border-white p-3 rounded-3xl">
              <QRCodeSVG
                // style={{
                //   width: "200px",
                //   height: "200px",
                // }}
                className="w-[180px] h-[180px]"
                value={qrCodeValue}
              />
            </div>

            <div className="text-xl font-semibold">Sign in with QR code</div>
            <div className="flex flex-col gap-3 justify-center items-center">
              <div className="max-w-[70%] text-sm text-[#9095A0] text-center">
                Use your phone camera to scan this code to log in instanly
              </div>
            </div>
          </div>
          {/* web Or Sign in with bar */}
          <div className="flex pn:max-sm:hidden items-center justify-center w-full">
            <hr className="flex-grow border-t text-[#9095A0] border-[#9095A0] " />
            <span className="px-3 font-medium text-[#9095A0] bg-transparent ">
              or Sign in with
            </span>
            <hr className="flex-grow border-t text-[#9095A0] border-[#9095A0]" />
          </div>

          <div className="font-bold text-center pn:max-sm:text-[30px] text-[25px] font-fugaz text-[#171717] ">
            Start your Adventure.
            <span className="text-[#0075ff]">Let's Begin!</span>
          </div>
          <div className="flex flex-col justify-center items-center  py-2">
            <div className="text-[#96A0AD] text-[15px] pn:max-sm:text-[12px] text-center px-10">
              We've missed you! Please sign in to catch up on what you've missed
            </div>
          </div>
          {/* switcher */}
          <div className="bg-[#f7f7f7] flex rounded-xl dark:text-[#171717] select-none text-[14px]">
            <div
              className={`duration-150 bg-white h-8 m-1 rounded-lg w-20 absolute z-0  ${change === 2 ? "ml-[91px]" : " "
                }`}
            ></div>
            <div
              onClick={() => {
                setChange(1);
              }}
              className="m-1 flex justify-center items-center h-8 w-20 z-10"
            >
              Phone no.
            </div>
            <div
              onClick={() => {
                setChange(2);
              }}
              className="m-1 flex justify-center items-center h-8 w-20 z-10"
            >
              email
            </div>
          </div>
          {/* phone */}
          <div
            className={`${change === 1
              ? "flex justify-start flex-col  items-start  py-4"
              : "hidden"
              }`}
          >
            <div className="bg-[#f7f7f7] flex items-center justify-center rounded-2xl">
              <div className="text-[#171717] pl-2">+91</div>
              <div className="h-[20px] ml-2 border-r-2 border-slate-200" />
              <input
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // onSignup();
                    fetchid();
                  }
                }}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Phone no."
                className="h-[50px] w-[260px] text-[#171717] outline-none bg-[#f7f7f7] rounded-r-2xl px-2 p-2 "
              />
            </div>
          </div>
          <div className={`${change === 1 ? "py-5 " : "hidden"}`}>
            <div
              onClick={fetchid}
              // onClick={onSignup}
              className="h-[50px] w-[300px] select-none cursor-pointer bg-black  flex items-center justify-center rounded-2xl text-white "
            >
              {loading && <CgSpinner size={20} className="m-1 animate-spin" />}
              <span className={`${loading ? "hidden" : ""}`}>Send Otp</span>
            </div>
          </div>
          {/* email */}
          <div className={`${change === 2 ? "" : "hidden"}`}>
            <div>
              <div className="text-black pn:max-sm:text-[15px] text-[15px] py-2">
                Email
              </div>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] w-[300px] ring-1 ring-[#f5f5f5] bg-[#f7f7f7] rounded-2xl px-4 outline-slate-100 "
                placeholder="Enter your email"
              />
            </div>
            <div>
              <div className="text-black pn:max-sm:text-[15px] text-[15px] py-2">
                Password
              </div>

              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="h-[50px] w-[300px] ring-1 ring-[#f5f5f5] bg-[#f7f7f7] rounded-2xl px-4 outline-slate-100 "
                placeholder="Enter your Password"
              />
            </div>
            <div className="py-5 ">
              <div
                onClick={handleCreate}
                className="h-[50px] w-[300px] select-none cursor-pointer bg-black  flex items-center justify-center rounded-2xl text-white "
              >
                <span>Continue</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default page;
