"use client";

import { useState } from "react";

// import React, { useState } from "react";
// import axios from "axios";
// import { API } from "@/Essentials";

function page() {
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");

  const data = {
    address: address,
    landmark: landmark,
    pincode: pincode,
    state: state,
  };

  const handleSave = async () => {
    try {
      if (
        !address.trim() ||
        !landmark.trim() ||
        !pincode.trim() ||
        !state.trim()
      ) {
        setToast({
          appear: true,
          text: "Please Fill all the details.",
          success: false,
        });
        setTimeout(() => {
          setToast({ appear: false });
        }, 2000);
      } else {
        const res = await axios.post(`${API}/updateAddress/${id}`, data);
        if (res?.data?.success) {
        } else {
          setToast({
            appear: true,
            text: "Something went wrong...",
            success: false,
          });
          setTimeout(() => {
            setToast({ appear: false });
          }, 2000);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="md:flex bg-green-300 text-black h-[91vh]">
      {/* For selecting address */}
      <div className="pn:max-md:w-[100%] md:min-w-[390px] pn:max-md:h-[100%] bg-[#f9f9f9] border-r-2 border-[#f9f9f9] flex items-center pt-2 flex-col">
        <div className="flex flex-row w-[100%] py-1   px-2 justify-between items-center">
          <div className="flex flex-row">
            <div className="text-black text-[14px]  font-bold px-2">
              SELECT DELIVERY ADDRESS
            </div>
          </div>
          {/* <div className="px-2 border-2 border-[#0075FF] text-[#0075FF] text-[10px] py-1 flex justify-center items-center rounded-md">
            Add new address
          </div> */}
        </div>
        <div className="w-[100%] flex flex-row justify-center">
          <div className="bg-white w-[80%] mt-2 py-2 border-2 rounded-md px-2 flex flex-row">
            {/* Details */}
            <div className="w-[70%] flex flex-col text-black text-[12px]">
              <div className="flex flex-row">
                <div className="font-bold">Salem Mirza</div>
                {/* <div className="text-[#2DC071] border-2 text-[8px] mx-1 rounded-md border-[#2DC071] px-1 ">
                  Home
                </div> */}
              </div>
              <div className="py-1">
                Kochi - Kanyakumari Hwy, Palayam Thiruvananthapuram, Kerala
              </div>

              <div className="py-1">695001</div>
              <div className="flex flex-row text-black">
                <div>Mobile: </div>
                <div className="font-bold">0471 247 0240</div>
              </div>
            </div>

            {/* editing and delete */}
            {/* <div className="w-[20%] flex justify-between px-1">
              <Image
                alt="edit"
                src={edit}
                className="h-[20px] w-[20px] object-scale-down"
              />
              <Image
                alt="delete"
                src={deletee}
                className="h-[20px] w-[20px] object-scale-down"
              />
            </div> */}
          </div>
        </div>
      </div>

      {/*  */}
      <div className="w-[100%] bg-white h-[100%] -pt-20 flex flex-col items-center  px-20">
        <div className="text-[20px] font-bold text-black h-[15%] flex justify-center items-center w-[100%] ">
          Add delivery address
        </div>

        {/* <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              First Name
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Salem"
            />
          </div>
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Last Name
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Salem"
            />
          </div>
        </div>

  
        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[100%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Email
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Salem"
            />
          </div>
        </div>


        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[100%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Phone number
            </div>
            <div className="h-[50%] w-[100%] flex flex-row justify-between">
              <input
                className="h-[100%] w-[10%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
                placeholder="+ 91"
              />
              <input
                className="h-[100%] w-[88%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
                placeholder="S+91"
              />
            </div>
          </div>
        </div> */}

        {/* Flat no */}
        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[100%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Flat/House no.
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Kochi - Kanyakumari Hwy, Palayam"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[100%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Address
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Thiruvananthapuram, Kerala"
            />
          </div>
        </div>

        {/* City and State */}
        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              City
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Thiruvananthapuram"
            />
          </div>
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              State
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Salem"
            />
          </div>
        </div>

        {/* Postal Code and Landmark */}
        <div className="flex flex-row h-[10%] text-[#585858] w-[100%] justify-between">
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Postal Code
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Thiruvananthapuram"
            />
          </div>
          <div className="h-[100%] w-[40%] flex flex-col ">
            <div className="text-[#585858] flex items-center text-[12px] h-[50%] w-[100%]">
              Landmark
            </div>
            <input
              className="h-[50%] w-[100%] px-2 border-2 rounded-lg outline-none text-[12px] text-black"
              placeholder="Salem"
            />
          </div>
        </div>

        <div className="flex justify-center items-center h-[10%]  w-[100%] font-semibold">
          <div
            onClick={handleSave}
            className="text-white  flex justify-center items-center bg-black w-[100%] h-[60%] rounded-lg "
          >
            Save Address
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
