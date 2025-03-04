"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";
import { useWebsiteContext } from "../WebsiteContext";
import { useState, useEffect } from "react";



const PersonalInfo = () => {
    const { fetchUserInfo, user, updateUserInfo } = useWebsiteContext();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [age, setAge] = useState(null);
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [personalEmail, setPersonalEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [course, setCourse] = useState("");

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
            setCourse(userData.userCourse);
            setStudentNumber(userData.userStudentNumber);
        };
    
        getUserData();
    }, [user]);
    

    const handleUpdate = () => {
        if (!user || !user.id) {
            alert("User not found!");
            return;
        }
    
        const updatedData = {
            nickname: nickname || null,  
            gender: gender || null,
            student_number: studentNumber || null,
            personal_email: personalEmail || null,
            mobile_number: mobileNumber.trim() || null, 
            course: course || null
        };
    
        updateUserInfo(user.id, updatedData);
    };

    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="preview_content">
                    <div className="profPic_cont">
                        <Image src="/images/materials/placeholderImg.png" alt="Placeholder Image" width={100} height={100} className="placeHolderProfile" />          

                        <button className="uploadBtn font-Montserrat text-min">Change Photo</button>
                    </div>

                    <div className="profInfo_cont">
                        <h2 className="profInfo_content"><span className="profInfo_label">Age:</span> {age}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">Course:</span> {course}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">PUP Email:</span> {email}</h2>
                    </div>
                </div>

                <div className="edit_profile my-8">
                        <h2 className="edit_label font-Red_Hat_Display text-white text-sm font-bold mx-10">Edit Profile</h2>

                        <div className="edit_inputs flex flex-row">
                            <div className="edit_input1 mx-14 flex flex-col gap-4">
                                <div className="nickname flex flex-col items-start mt-4">
                                    <input type="text" placeholder="Nickname" className="personalInfo_inputs" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                                    <label className="personalInfo_labels">Nickname</label>
                                </div>
                            
                                <div className="gender flex flex-col items-start">
                                    <input type="text" placeholder="Gender" className="personalInfo_inputs" value={gender} onChange={(e) => setGender(e.target.value)}/>
                                    <label className="personalInfo_labels">Gender</label>
                                </div>
                                
                                <div className="gender flex flex-col items-start mb-4">
                                    <input type="text" placeholder="Student No." className="personalInfo_inputs" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)}/>
                                    <label className="personalInfo_labels">Student Number</label>
                                </div>
                            </div>
                            
                            <div className="edit_input2 mx-14 flex flex-col gap-4">
                                <div className="personalEmail flex flex-col items-start mt-4">
                                    <input type="text" placeholder="Personal Email Address" className="personalInfo_inputs" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)}/>
                                    <label className="personalInfo_labels">Personal Email Address</label>
                                </div>
                            
                                <div className="mobileNo flex flex-col items-start">
                                    <input type="text" placeholder="Mobile Number" className="personalInfo_inputs" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}/>
                                    <label className="personalInfo_labels">Mobile Number</label>
                                </div>
                                
                                <div className="mobileNo flex flex-col items-start mb-4">
                                    <input type="text" placeholder="Course" className="personalInfo_inputs" value={course} onChange={(e) => setCourse(e.target.value)}/>
                                    <label className="personalInfo_labels">Course</label>
                                </div>
                            </div>
                        </div>
                        
                        <button className="updateInformation_btn" onClick={handleUpdate}>Update Information</button>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo;