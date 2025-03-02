"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";


const PersonalInfo = () => {
    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="preview_content">
                    <div className="profPic_cont">
                        <Image src="/images/materials/placeholderImg.png" alt="Placeholder Image" width={100} height={100} className="placeHolderProfile" />          

                        <button className="uploadBtn font-Montserrat text-min">Change Photo</button>
                    </div>

                    <div className="profInfo_cont">
                        <h2 className="profInfo_content"><span className="profInfo_label">Age:</span> 22</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">Course:</span> Bachelor of Science in Computer Engineering</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">PUP Email:</span> acelawrencezclavano@iskolarngbayan.edu.ph</h2>
                    </div>
                </div>

                <div className="edit_profile my-8">
                        <h2 className="edit_label font-Red_Hat_Display text-white text-sm font-bold mx-10">Edit Profile</h2>

                        <div className="edit_inputs flex flex-row">
                            <div className="edit_input1 mx-14 flex flex-col gap-4">
                                <div className="nickname flex flex-col items-start mt-4">
                                    <input type="text" placeholder="Nickname" className="personalInfo_inputs"/>
                                    <label className="personalInfo_labels">Nickname</label>
                                </div>
                            
                                <div className="gender flex flex-col items-start mb-4">
                                    <input type="text" placeholder="Gender" className="personalInfo_inputs"/>
                                    <label className="personalInfo_labels">Gender</label>
                                </div>
                            </div>
                            
                            <div className="edit_input2 mx-14 flex flex-col gap-4">
                                <div className="personalEmail flex flex-col items-start mt-4">
                                    <input type="text" placeholder="Personal Email Address" className="personalInfo_inputs"/>
                                    <label className="personalInfo_labels">Personal Email Address</label>
                                </div>
                            
                                <div className="mobileNo flex flex-col items-start mb-4">
                                    <input type="text" placeholder="Mobile Number" className="personalInfo_inputs"/>
                                    <label className="personalInfo_labels">Mobile Number</label>
                                </div>
                            </div>
                        </div>
                        
                        <button className="updateInformation_btn">Update Information</button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo;