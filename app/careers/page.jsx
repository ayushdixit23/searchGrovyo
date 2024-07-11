"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
// Import the main component

import { LuAsterisk } from "react-icons/lu";

const page = () => {
  const [formtoSend, setFormtoSend] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    doc: "",
    batch: "",
    job: "WEB DEVELOPER",
    perspective: "",
    yourAchievements: "",
    experienceUsingGrovyo: "",
    careerPlans: "",
  });
  const [loading, setLoading] = useState(false);

  const handleFileChangeCol = (e) => {
    const selectedFile = e.target.files[0];

    // Check if no file is selected
    if (!selectedFile) {
      return; // or handle accordingly
    }

    // Check if the selected file type is not an image
    if (!selectedFile.type.startsWith("image")) {
      toast.error("Only Image Can be Selected");
      setFormtoSend({
        ...formtoSend,
        doc: "", // Clear the selected file
      });
      return;
    }

    // If it's an image, update the form state
    setFormtoSend({
      ...formtoSend,
      doc: selectedFile,
    });
  };

  const handleChanges = (e) => {
    const { value, name } = e.target;
    setFormtoSend({
      ...formtoSend,
      [name]: value,
    });
  };

  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const handleSelectClick = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (job) => {
    setFormtoSend({ ...formtoSend, job });
    setShowOptions(false);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formtoSend.doc ||
      !formtoSend.email ||
      !formtoSend.batch ||
      !formtoSend.phone ||
      !formtoSend.name ||
      !formtoSend.message ||
      !formtoSend.careerPlans ||
      !formtoSend.yourAchievements ||
      !formtoSend.perspective ||
      !formtoSend.job ||
      !formtoSend.experienceUsingGrovyo
    ) {
      toast.error("Please Enter All Required Details");
      return;
    }

    const data = new FormData();
    data.append("name", formtoSend.name);
    data.append("email", formtoSend.email);
    data.append("phone", formtoSend.phone);
    data.append("doc", formtoSend.doc);
    data.append("message", formtoSend.message);
    data.append("batch", formtoSend.batch);
    data.append("job", formtoSend.job);
    data.append("perspective", formtoSend.perspective);
    data.append("experienceUsingGrovyo", formtoSend.experienceUsingGrovyo);
    data.append("careerPlans", formtoSend.careerPlans);
    data.append("yourAchievements", formtoSend.yourAchievements);

    try {
      const res = await axios.post(
        "https://supdmin.grovyo.xyz/api/v1/form",
        data
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success("Details Submitted!");
        setFormtoSend({
          name: "",
          doc: "",
          perspective: "",
          yourAchievements: "",
          experienceUsingGrovyo: "",
          careerPlans: "",
          batch: "",
          phone: "",
          email: "",
          job: "WEB DEVELOPER",
        });
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        toast.error("Something Went Wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <>
        <Toaster />
        <div className="fixed inset-0 w-screen z-50 bg-black bg-opacity-90 backdrop-blur-lg h-screen flex justify-center items-center">
          <div className="animate-spin">
            <AiOutlineLoading3Quarters className="text-2xl text-white" />
          </div>
        </div>
      </>
    );
  }

  // return (
  //   <>
  //     <Toaster />
  //     <div className="h-screen  bg-gradient-to-r from-[#000000] via-[#111827] to-[#000000] flex p-2 justify-center items-center ">
  //       <form
  //         onSubmit={sendData}
  //         id="contact-me"
  //         autoComplete="off"
  //         className="w-full mx-auto overflow-y-scroll no-scrollbar max-h-[95vh] max-w-3xl justify-center bg-[#f9f9f9] sm:px-4 relative text-white shadow-lg shadow-white-500/5 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ring-1 ring-[#f4f4f452] sm:py-2 rounded-[24px] p-4 sm:p-8  "
  //       >
  //         <h2 className="w-full  text-2xl font-bold leading-tight mt-3 mb-4 flex justify-center items-center">
  //           Grovyo Career Form
  //         </h2>
  //         {/* <!-- name field --> */}
  //         <div className="flex flex-wrap mb-2 ">
  //           <div className="relative w-full z-0 mb-5 group appearance-none label-floating">
  //             <input
  //               autoComplete="off"
  //               onChange={handleChanges}
  //               value={formtoSend.name}
  //               type="text"
  //               name="name"
  //               id="name"
  //               className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  //               placeholder=" "
  //               required
  //             />
  //             <label
  //               htmlFor="name"
  //               className="peer-focus:font-medium absolute flex justify-center items-center text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  //             >
  //               Your Name <LuAsterisk className="text-red-800" />
  //             </label>
  //           </div>
  //         </div>
  //         {/* <!-- email field --> */}
  //         <div className="flex flex-wrap mb-2">
  //           <div className="relative w-full z-0 mb-5 group appearance-none label-floating">
  //             <input
  //               autoComplete="off"
  //               onChange={handleChanges}
  //               value={formtoSend.email}
  //               type="email"
  //               name="email"
  //               id="email"
  //               className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  //               placeholder=" "
  //               required
  //             />
  //             <label
  //               htmlFor="email"
  //               className="peer-focus:font-medium absolute text-sm flex justify-center items-center text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  //             >
  //               Your Email address <LuAsterisk className="text-red-800 " />
  //             </label>
  //           </div>
  //         </div>
  //         <div className="flex flex-wrap mb-2">
  //           <div className="relative w-full z-0 mb-5 group appearance-none label-floating">
  //             <input
  //               autoComplete="off"
  //               onChange={handleChanges}
  //               value={formtoSend.phone}
  //               type="tel"
  //               name="phone"
  //               id="tel"
  //               className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  //               placeholder=" "
  //               required
  //             />
  //             <label
  //               htmlFor="tel"
  //               className="peer-focus:font-medium absolute text-sm flex justify-center items-center text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  //             >
  //               Your Phone Number <LuAsterisk className="text-red-800" />
  //             </label>
  //           </div>
  //         </div>
  //         <div className="flex flex-wrap mb-2">
  //           <div className="relative w-full z-0 mb-5 group appearance-none label-floating">
  //             <input
  //               autoComplete="off"
  //               onChange={handleChanges}
  //               value={formtoSend.batch}
  //               type="text"
  //               name="batch"
  //               id="batch"
  //               className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
  //               placeholder=" "
  //               required
  //             />
  //             <label
  //               htmlFor="tel"
  //               className="peer-focus:font-medium absolute text-sm flex justify-center items-center text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
  //             >
  //               Your Education Status <LuAsterisk className="text-red-800" />
  //             </label>
  //           </div>
  //         </div>

  //         <div className="flex flex-wrap mb-2">
  //           <div className="relative w-full z-0 text-sm text-gray-500 mb-5 group appearance-none label-floating">
  //             <label htmlFor="fileInput">
  //               <div className="flex items-center">
  //                 Upload Your Resume <LuAsterisk className="text-red-800" />
  //               </div>
  //               {formtoSend.doc !== "" ? (
  //                 <div className="flex items-center">
  //                   {formtoSend?.doc &&
  //                   formtoSend.doc?.type?.startsWith("image/") ? (
  //                     <img
  //                       src={URL.createObjectURL(formtoSend.doc)}
  //                       alt="image"
  //                       className="max-w-[150px] mt-2 rounded-xl w-full h-full object-cover"
  //                     />
  //                   ) : (
  //                     <div className="my-2 text-xl font-semibold">
  //                       File Selected
  //                     </div>
  //                   )}
  //                 </div>
  //               ) : (
  //                 <div className="border-2 p-6 mt-2 h-[100px] border-dashed rounded-xl flex justify-center items-center">
  //                   <FaPlus />
  //                 </div>
  //               )}
  //             </label>
  //             <input
  //               autoComplete="off"
  //               type="file"
  //               required
  //               accept="image/*,application/pdf"
  //               id="fileInput"
  //               className="hidden"
  //               onChange={(e) => handleFileChangeCol(e)}
  //             />
  //           </div>
  //         </div>
  //         <div className="mb-4 -mt-2">
  //           <div>
  //             <label htmlFor="select" className="text-sm  flex items-center">
  //               Select Your Job <LuAsterisk className="text-red-800" />
  //             </label>
  //             <div className={`relative`}>
  //               <div
  //                 className="h-10  flex border border-gray-200 rounded items-center"
  //                 onClick={handleSelectClick}
  //               >
  //                 <input
  //                   autoComplete="off"
  //                   value={formtoSend.job}
  //                   name="select"
  //                   id="select"
  //                   className="px-4 appearance-none bg-transparent outline-none text-gray-300 w-full"
  //                   checked
  //                 />
  //                 <button
  //                   onClick={() => {
  //                     setFormtoSend({ ...formtoSend, job: "" });
  //                   }}
  //                   className="cursor-pointer  outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"
  //                 >
  //                   <svg
  //                     className="w-4 h-4 mx-2 fill-current"
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                     strokeWidth="2"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                   >
  //                     <line x1="18" y1="6" x2="6" y2="18"></line>
  //                     <line x1="6" y1="6" x2="18" y2="18"></line>
  //                   </svg>
  //                 </button>
  //                 <label
  //                   htmlFor="show_more"
  //                   className="cursor-pointer outline-none focus:outline-none border-l border-gray-300 transition-all text-gray-300 hover:text-gray-600"
  //                 >
  //                   <svg
  //                     className="w-4 h-4 mx-2 fill-current"
  //                     xmlns="http://www.w3.org/2000/svg"
  //                     viewBox="0 0 24 24"
  //                     stroke="currentColor"
  //                     strokeWidth="2"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                   >
  //                     <polyline points="18 15 12 9 6 15"></polyline>
  //                   </svg>
  //                 </label>
  //               </div>
  //               <input
  //                 autoComplete="off"
  //                 type="checkbox"
  //                 name="show_more"
  //                 id="show_more"
  //                 className="hidden peer"
  //               />
  //               <div
  //                 className={`absolute rounded shadow  bg-black text-white overflow-hidden ${
  //                   showOptions ? "flex" : "hidden"
  //                 } flex-col w-full mt-1 border border-gray-200`}
  //               >
  //                 <div
  //                   onClick={() => handleOptionClick("WEB DEVELOPER")}
  //                   className="cursor-pointer group "
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     WEB DEVELOPER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("UI/UX DESIGNER")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 border-blue-600 ">
  //                     UI/UX DESIGNER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("BACKEND DEVELOPER")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     BACKEND DEVELOPER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("GRAPHIC DESIGNER")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     GRAPHIC DESIGNER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("APP FRONTEND DEVELOPER")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     APP FRONTEND DEVELOPER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("CONTENT WRITER")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     CONTENT WRITER
  //                   </a>
  //                 </div>
  //                 <div
  //                   onClick={() => handleOptionClick("SOCIAL MEDIA MANAGEMENT")}
  //                   className="cursor-pointer group border-t"
  //                 >
  //                   <a className="block p-2 border-transparent border-l-4  group-hover:border-blue-600 ">
  //                     SOCIAL MEDIA MANAGEMENT
  //                   </a>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         {/* 1  */}
  //         <div className="flex flex-wrap mb-2">
  //           <label
  //             htmlFor="message"
  //             className="mb-2 flex justify-center items-center text-sm text-gray-500 font-medium"
  //           >
  //             1. Why you are great for this job ?{" "}
  //             <LuAsterisk className="text-red-800" />
  //           </label>
  //           <textarea
  //             id="message"
  //             autoComplete="off"
  //             rows="4"
  //             value={formtoSend.message}
  //             onChange={handleChanges}
  //             name="message"
  //             className="block p-2.5 w-full text-sm bg-transparent focus:border-blue-500 outline-none border-gray-300 rounded-lg border focus:ring-blue-500"
  //             required
  //             placeholder="Enter here"
  //           ></textarea>
  //         </div>
  //         {/* 2 */}
  //         <div className="flex flex-wrap mb-2">
  //           <label
  //             htmlFor="experienceUsingGrovyo"
  //             className="     mb-2 flex justify-center items-center text-sm text-gray-500 font-medium"
  //           >
  //             <div>
  //               2. What is your overall experience with{" "}
  //               <a
  //                 target="_blank"
  //                 className="text-blue-500 underline"
  //                 href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en_IN&gl=US"
  //               >
  //                 Grovyo application
  //               </a>
  //               .
  //             </div>

  //             <LuAsterisk className="text-red-800" />
  //           </label>
  //           <textarea
  //             id="experienceUsingGrovyo"
  //             autoComplete="off"
  //             rows="4"
  //             value={formtoSend.experienceUsingGrovyo}
  //             onChange={handleChanges}
  //             name="experienceUsingGrovyo"
  //             className="block p-2.5 w-full text-sm bg-transparent focus:border-blue-500 outline-none border-gray-300 rounded-lg border focus:ring-blue-500"
  //             required
  //             placeholder="Enter here"
  //           ></textarea>
  //         </div>

  //         {/* 3 */}

  //         <div className="flex flex-wrap mb-2">
  //           <label
  //             htmlFor="perspective"
  //             className="mb-2 flex justify-center items-center text-sm text-gray-500 font-medium"
  //           >
  //             3. What is
  //             <a
  //               target="_blank"
  //               className="text-blue-500 px-1 underline"
  //               href="https://play.google.com/store/apps/details?id=com.grovyomain&hl=en_IN&gl=US"
  //             >
  //               Grovyo
  //             </a>{" "}
  //             from your perspective?
  //             <LuAsterisk className="text-red-800" />
  //           </label>
  //           <textarea
  //             id="perspective"
  //             autoComplete="off"
  //             rows="4"
  //             value={formtoSend.perspective}
  //             onChange={handleChanges}
  //             name="perspective"
  //             className="block p-2.5 w-full text-sm bg-transparent focus:border-blue-500 outline-none border-gray-300 rounded-lg border focus:ring-blue-500"
  //             required
  //             placeholder="Enter here"
  //           ></textarea>
  //         </div>

  //         <div className="flex flex-wrap mb-2">
  //           <label
  //             htmlFor="yourAchievements"
  //             className="     mb-2 flex justify-center items-center text-sm text-gray-500 font-medium"
  //           >
  //             4. Tell us your achievements.
  //             <LuAsterisk className="text-red-800" />
  //           </label>
  //           <textarea
  //             id="yourAchievements"
  //             autoComplete="off"
  //             rows="4"
  //             value={formtoSend.yourAchievements}
  //             onChange={handleChanges}
  //             name="yourAchievements"
  //             className="block p-2.5 w-full text-sm bg-transparent focus:border-blue-500 outline-none border-gray-300 rounded-lg border focus:ring-blue-500"
  //             required
  //             placeholder="Enter here"
  //           ></textarea>
  //         </div>
  //         {/* 4 */}

  //         {/* 5  */}
  //         <div className="flex flex-wrap mb-2">
  //           <label
  //             htmlFor="careerPlans"
  //             className="mb-2 flex justify-center items-center text-sm text-gray-500 font-medium"
  //           >
  //             5. What are your short-term and long-term career goals ?
  //           </label>
  //           <textarea
  //             id="careerPlans"
  //             autoComplete="off"
  //             rows="4"
  //             value={formtoSend.careerPlans}
  //             onChange={handleChanges}
  //             name="careerPlans"
  //             className="block p-2.5 w-full text-sm bg-transparent focus:border-blue-500 outline-none border-gray-300 rounded-lg border focus:ring-blue-500"
  //             required
  //             placeholder="Enter here"
  //           ></textarea>
  //         </div>

  //         <div className="">
  //           <button
  //             className="w-full shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
  //             type="submit"
  //           >
  //             Send
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </>
  // );

  return (
    <main className="text-white h-screen bg-gradient-to-r from-[#000000] via-[#111827] to-[#000000] p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold text-white mb-4">
        Registration Closed
      </h1>
      <p className="text-white mb-6">
        Thank you for your interest! Unfortunately, registration is currently
        closed.
      </p>
      <p className="text-white">
        Please check back later or contact support for more information.
      </p>
    </main>
  );
};

export default page;
