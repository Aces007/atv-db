"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";

import PersonalInfo from "../personalinfopanel/page";
import Security from "../securitypanel/page";
import MyLibrary from "../mylibrarypanel/page";
import { useState, useEffect } from "react";
import { useWebsiteContext } from "../WebsiteContext";


const Profile = () => {
    const [selectedSection, setSelectedSection] = useState('PersonalInfo');
    const { fetchUserInfo, user } = useWebsiteContext();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [age, setAge] = useState(null);
    const [studentNumber, setStudentNumber] = useState("");

    useEffect(() => {
        if (!user || !user.id) {
            console.warn("User is not available yet.");
            return;
        }

        console.log('userId in UserProfile:', user.id); 

        const getUserData = async () => {
            const userData = await fetchUserInfo(user.id);
            if (!userData) {
                console.error("User data not found.");
                return;
            }

            setName(userData.full_name);
            setEmail(userData.userEmail);
            setBirthdate(userData.userBirthdate);
            setAge(userData.userAge);
            setStudentNumber(userData.userStudentNumber)
        };

        getUserData();
    }, [user]);

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
                                <h1 className="font-Red_Hat_Display font-bold text-min">{name}</h1>
                                <h1 className="font-Red_Hat_Display text-min">{studentNumber}</h1>
                            </div>
                        </div>

                        <div className="profile_btns flex flex-col items-start justify-around gap-5">
                            <button 
                                className="profile_menu font-Montserrat text-sm flex flex-row items-center gap-4"
                                onClick={() => setSelectedSection("PersonalInfo")}
                            >
                                    <FontAwesomeIcon icon={faUser} size="1x" className="profileSVGs" />Personal Info</button>
                            <button 
                                className="profile_menu font-Montserrat text-sm flex flex-row items-center gap-4"
                                onClick={() => setSelectedSection("Security")}
                            >
                                    <FontAwesomeIcon icon={faLock} size="1x" className="profileSVGs" />Security</button>
                            <button 
                                className="profile_menu font-Montserrat text-sm flex flex-row items-center gap-4"
                                onClick={() => setSelectedSection("MyLibrary")}
                            >
                                    <FontAwesomeIcon icon={faBook} size="1x" className="profileSVGs" />My Library</button>
                        </div>
                    </div>
                    
                    <div className="right_panel">
                        {selectedSection === "PersonalInfo" && <PersonalInfo />}
                        {selectedSection === "Security" && <Security />}
                        {selectedSection === "MyLibrary" && <MyLibrary />}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Profile;