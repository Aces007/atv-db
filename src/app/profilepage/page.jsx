"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe } from "@fortawesome/free-solid-svg-icons";


const Profile = () => {
    return (
        <div className="profile_cont">
            <div className="profile_content">
                <Header />

                <div className="profile_info flex flex-row justify-between mx-16 my-4 tracking-min">
                    <div className="left_panel flex flex-col gap-6">
                        <h1 className="font-Red_Hat_Display uppercase font-extrabold text-sm">Your Account</h1>

                        <div className="user_basic flex flex-row gap-4">
                            <Image src="/images/materials/placeholderImg.png" alt="Placeholder Image" width={50} height={50} className="placeHolderImg" />

                            <div className="user_basic_info">
                                <h1 className="font-Red_Hat_Display font-bold text-min">Ace Lawrence Z. Clavano</h1>
                                <h1 className="font-Red_Hat_Display text-min">2021-05773-MN-0</h1>
                            </div>
                        </div>

                        <div className="profile_btns flex flex-col items-start justify-around gap-4">
                            <button className="profile_menu font-Montserrat text-min flex flex-row items-center gap-2"><FontAwesomeIcon icon={faUser} size="1x" className="profileSVGs" />Personal Info</button>
                            <button className="profile_menu font-Montserrat text-min flex flex-row items-center gap-2"><FontAwesomeIcon icon={faLock} size="1x" className="profileSVGs" />Security</button>
                            <Link href={"https://sis8.pup.edu.ph/"} target="_blank"><button className="profile_menu font-Montserrat text-min flex flex-row items-center gap-2"><FontAwesomeIcon icon={faGlobe} size="1x" className="profileSVGs" />PUP SIS</button></Link>
                        </div>
                    </div>
                    
                    <div className="right_panel">
                        <h1>Edit Profile</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;