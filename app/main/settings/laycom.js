"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import Sidebar from "../component/Sidebar";
import LogoutModal from "../../component/LogOut";
// import MobileNav from "../component/MobileNav";
import Image from "next/image";
// import { getData } from "../utils/useful";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "../../utils/AuthWrapper";
import Cookies from "js-cookie";
import { MdOutlineCampaign, MdOutlineLogout, MdVerified } from "react-icons/md";
import { FaUser, FaUsers } from "react-icons/fa";
import { IoChatbubbleSharp } from "react-icons/io5";
import { CgWebsite } from "react-icons/cg";
import { HiCurrencyDollar } from "react-icons/hi";
import { FiHelpCircle } from "react-icons/fi";
import Account from "./account/page";
import SettingChat from "./chat/page";
import SettingCommunity from "./community/page";

export default function SettingLayout({ children }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const searchparams = useSearchParams();
	const { data, setAuth, setData } = useAuthContext();
	const path = usePathname();
	const [isMobile, setIsMobile] = useState(false);
	const type = searchparams.get("type");
	const router = useRouter();

	const handleLogout = () => {
		setIsModalOpen(false);

		// Add your logout logic here
	};

	const deleteCookies = () => {
		Cookies.remove(`access_token`);
		Cookies.remove(`refresh_token`);
		setAuth(false);
		setTimeout(() => {
			setData("");
		}, 3000);
		router.push("/login");
	};

	useEffect(() => {
		const initialWidth = window.innerWidth;
		if (initialWidth > 821) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}
	}, []);

	useEffect(() => {
		const handleResize = () => {
			const initialWidth = window.innerWidth;
			if (initialWidth > 821) {
				setIsMobile(false);
			} else {
				setIsMobile(true);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// (() => {
	//   if (
	//     typeof window !== "undefined" &&
	//     window.history &&
	//     window.history.pushState
	//   ) {
	//     window.addEventListener("popstate", function () {
	//       if (typeof setIsChildrenHidden === "function") {
	//         setIsChildrenHidden(false);
	//       }
	//     });
	//   } else {
	//     console.warn("History API is not supported by this browser");
	//   }
	// })();

	return (
		<>
			<div className="w-[100%] h-[100vh] bg-white dark:bg-[#0D0F10] flex pn:max-md:justify-center ">
				{!type && (
					<div className=" pn:max-md:h-[100vh] h-screen overflow-auto scrollbar-hide select-none md:min-w-[390px] lg:w-[360px] flex flex-col items-center md:border-r-2 dark:border-none border-[#f7f7f7] self-end w-full">
						<div
							className="w-[100%] h-[10%] dark:bg-[#0D0F10] light:border-b dark:border dark:border-[#131619] 
           flex flex-row px-5 justify-between items-center pn:max-md:h-[50px]"
						>
							<div className="text-[24px] text-black dark:text-white font-sans font-semibold">
								Settings
							</div>
						</div>

						<div
							className={`md:col-span-1 w-full dark:bg-[#0D0F10] dark:border dark:border-[#131619] sm:col-span-2 h-[90%] bg-maincolor max-h-screen `}
						>
							<div className="flex mt-4 pl-3 flex-col w-full">
								<Link
									href={
										isMobile
											? "/main/settings?type=account"
											: "/main/settings/account"
									}
									className={`text-sm ${path == "/main/settings" || path == "/main/settings/account"
										? isMobile
											? ""
											: "text-blue-600"
										: ""
										} rounded-xl flex items-center gap-3 my-2 sm:max-md:p-2 p-4 py-3 font-semibold`}
								>
									<div>
										<FaUser className="text-xl" />
									</div>
									<div>Account</div>
								</Link>

								<Link
									href={
										isMobile
											? "/main/settings?type=chat"
											: "/main/settings/chat"
									}
									className={`text-sm rounded-xl ${path == "/main/settings/chat" ? "text-blue-600" : ""
										} flex items-center gap-3 my-2 sm:max-md:p-2 p-4 py-3  font-semibold`}
								>
									<div>
										<IoChatbubbleSharp className="text-xl" />
									</div>
									<div>Chats</div>
								</Link>

								<a
									target="_blank"
									href={`https://prosite.grovyo.com/lwozxip?id=${encodeURIComponent(
										data?.id
									)}&temp=1&addData=false`}
									className="text-sm rounded-xl flex items-center gap-3 my-2 sm:max-md:p-2 p-4 py-3  font-semibold"
								>
									<div>
										<CgWebsite className="text-xl" />
									</div>
									<div>Prosite</div>
								</a>

								<Link
									href={
										isMobile
											? "/main/settings?type=community"
											: "/main/settings/community"
									}
									className={`text-sm rounded-xl ${path == "/main/settings/community" ? "text-blue-600" : ""
										} flex items-center gap-3 my-2 sm:max-md:p-2 p-4 py-3  font-semibold`}
								>
									<div>
										<FaUsers className="text-xl" />
									</div>
									<div>Communities</div>
								</Link>

								<a
									target="_blank"
									href={`https://ads.grovyo.com/alginsf?zray=${data?.id}`}
									// href={`https://ads.grovyo.com/alginsf?zray=${data?.id}`}
									className="text-sm rounded-xl my-2 flex items-center gap-3 sm:max-md:p-2 p-4 py-3  font-semibold"
								>
									<div>
										<MdOutlineCampaign className="text-2xl" />
									</div>
									<div>Create Your Ad</div>
								</a>
								<a
									target="_blank"
									href={`https://grovyo.com/features/earnwithus`}
									className="text-sm rounded-xl my-2 flex items-center gap-3 sm:max-md:p-2 p-4  py-3  font-semibold"
								>
									<div>
										<HiCurrencyDollar className="text-2xl" />
									</div>
									<div> Earn With US</div>
								</a>
								<div className="text-sm rounded-xl my-2 flex items-center gap-3 sm:max-md:p-2 p-4  py-3  font-semibold">
									<div>
										<FiHelpCircle className="text-xl" />
									</div>
									<div>Help</div>
								</div>
								<div
									onClick={() => setIsModalOpen(true)}
									className=" text-sm sm:max-md:p-2 p-4 py-3 text-red-700  my-2 rounded-xl  flex items-center gap-3 font-semibold"
								>
									<div>
										<MdOutlineLogout className="text-xl" />
									</div>
									<div>Log Out</div>
								</div>
								<LogoutModal
									isOpen={isModalOpen}
									onClose={() => setIsModalOpen(false)}
									// onLogout={handleLogout}
									onLogout={deleteCookies}
								/>
							</div>
						</div>
					</div>
				)}
				{type == "account" && <Account />}
				{type == "chat" && <SettingChat />}
				{type == "community" && <SettingCommunity />}
				<div className="w-full pn:max-sm:hidden"> {children}</div>
			</div>
		</>
	);
}
