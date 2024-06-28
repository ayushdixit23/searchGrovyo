import React, { useEffect, useState } from "react";
import Image from "next/image";
// import box from "../../assets/Images/Box.png";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";


function Store(props) {
  const [productt, setProductt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  const calculateDif = (a, b) => {
    const dif = Number(b) - Number(a);
    const per = Math.ceil((dif / b) * 100);
    return per;
  };

  useEffect(() => {
    if (props.product) {
      // Simulate a delay (you can replace this with your data fetching logic)
      setTimeout(() => {
        setProductt(props.product);
        setIsLoading(false); // Set loading state to false when data is available
      }, 2000); // Simulate a 2-second delay
    }
  }, [props.product]);

  console.log(productt, "products")

  return (
    <>
      {props?.isStore && (
        <div className="md:flex gap-2 w-full grid  grid-cols-2 sm:grid-cols-3 p-3 items-center md:flex-wrap md:justify-center">
          {productt.map((d, i) => (
            <div
              key={i}
              className="flex flex-col justify-center border-[2px] dark:border-[#323d4e] light:border-[#f9f9f9] rounded-xl w-full sm:max-w-[220px] p-2 "
            >
              <div className="bg-[#f9f9f9] dark:bg-bluedark dark:text-white flex-wrap flex justify-center items-center rounded-lg py-3">
                <div className="h-[170px] w-[200px] flex justify-center items-center ">
                  <img
                    src={`${d?.dp}`}
                    alt="img"
                    className="sm:w-[170px] w-full h-[170px] "
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 my-2 text-lg font-medium">
                <div className="text-base dark:text-white font-semibold sm:h-[20px] ">
                  {d?.name.length > 20 ? `${d?.name.slice(0, 20)}...` : d?.name}
                </div>
                {/* <div className="text-[#737373] text-[14px]">
                  sold by {d?.brandname}
                </div> */}
                <div className="text-[17px] dark:text-white flex gap-1 items-center font-bold">
                  <div>₹ {d?.isvariant ? d?.variants[0].category[0].discountedprice : d?.discountedprice}</div>
                  {d?.isvariant ?
                    <span className="text-sm dark:text-white font-semibold text-[#5585FF]">
                      {calculateDif(d?.variants[0].category[0].discountedprice, d?.variants[0].category[0].price)}% off
                    </span> :
                    <span className="text-sm font-semibold text-[#5585FF]">
                      {calculateDif(d?.discountedprice, d?.price)}% off
                    </span>
                  }
                </div>
                <div className="font-semibold dark:text-white text-sm">
                  M.R.P:
                  <del className="font-medium p-2 text-[#FF0000]">
                    ₹{d?.isvariant ? d?.variants[0].category[0].price : d?.price}
                  </del>
                </div>
              </div>


              < Link
                href={`/product/${d?._id}`}
                className="text-black ring-1 ring-black bg-white rounded-2xl flex justify-center items-center space-x-2 h-8 sm:h-12 w-full"
              >
                View
              </Link>

            </div>
          ))}


        </div >
      )
      }
    </>
  );
}

export default Store;
