"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";
import { useWebsiteContext } from "../WebsiteContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const PersonalInfo = () => {
    const { fetchUserInfo, user, updateUserInfo } = useWebsiteContext();
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [age, setAge] = useState(null);
    
    // Consolidate personal information into a single object state
    const [personalInfo, setPersonalInfo] = useState({
        nickname: "",
        gender: "",
        studentNumber: "",
        personalEmail: "",
        mobileNumber: "",
        course: ""
    });

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
            
            setPersonalInfo({
                nickname: userData.nickname || "",
                gender: userData.gender || "",
                studentNumber: userData.userStudentNumber || "",
                personalEmail: userData.userPersonalEmail || "",
                mobileNumber: userData.userMobileNumber || "",
                course: userData.userCourse || "",
                profileUrl: userData.profile_url || ""
            });
        };

        getUserData();
    }, [user]);

    const handleUpdate = async () => {
        if (!user || !user.id) {
            alert("User not found!");
            return;
        }

        try {
            await updateUserInfo(user.id, personalInfo);
            
            // Refresh local state with updated info
            const refreshedData = await fetchUserInfo(user.id);

            if (refreshedData) {
                setPersonalInfo({
                nickname: refreshedData.nickname || "",
                gender: refreshedData.gender || "",
                studentNumber: refreshedData.userStudentNumber || "",
                personalEmail: refreshedData.userPersonalEmail || "",
                mobileNumber: refreshedData.userMobileNumber || "",
                course: refreshedData.userCourse || "",
                profileUrl: userData.profile_url || ""
            });
            alert("Information updated successfully!");

            } else {
                setPersonalInfo({
                    nickname: "",
                    gender: "",
                    studentNumber: "",
                    personalEmail: "",
                    mobileNumber: "",
                    course: ""
                });
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleUploadProfile = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file || !user?.id) {
                alert("Please select a file and ensure you're logged in");
                return;
            }

            // Validate file type
            const fileExt = file.name.split('.').pop().toLowerCase();
            const validTypes = ['jpg', 'jpeg', 'png', 'gif'];
            if (!validTypes.includes(fileExt)) {
                alert("Please upload an image file (jpg, jpeg, png, gif)");
                return;
            }

            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("profile_pictures")
                .upload(filePath, file, { 
                    upsert: true,
                    cacheControl: '3600'
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert(`Upload failed: ${uploadError.message}`);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("profile_pictures")
                .getPublicUrl(filePath);

            // Update user profile
            const { error: updateError } = await supabase
                .from("Users")
                .update({ profile_url: publicUrl })
                .eq("id", user.id)

            if (updateError) {
                console.error("Profile update error:", updateError);
                alert(`Failed to update profile: ${updateError.message}`);
                return;
            }

            setPersonalInfo(prev => ({ ...prev, profileUrl: publicUrl }));
            alert("Profile picture updated successfully!");

        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }

        console.log('Storage URL:', supabase.storage.url);
    };
    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="preview_content">
                    <div className="profPic_cont">
                        <Image src={personalInfo.profileUrl ||"/images/materials/placeholderImg.png"} alt="Placeholder Image" width={100} height={100} className="placeHolderProfile" />

                        <input type="file" accept="image/*" id="profileUpload" style={{ display: "none" }} onChange={handleUploadProfile}/>
                        <button className="uploadBtn font-Montserrat text-min" onClick={() => document.getElementById("profileUpload").click()}>Change Photo</button>
                    </div>

                    <div className="profInfo_cont">
                        <h2 className="profInfo_content"><span className="profInfo_label">Nickname:</span> {personalInfo.nickname}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">Gender:</span> {personalInfo.gender}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">Course:</span> {personalInfo.course}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">Personal Email:</span> {personalInfo.personalEmail}</h2>
                        <h2 className="profInfo_content"><span className="profInfo_label">PUP Email:</span> {email}</h2>
                    </div>
                </div>

                <div className="edit_profile my-8">
                    <h2 className="edit_label font-Red_Hat_Display text-white text-sm font-bold mx-10">Edit Profile</h2>

                    <div className="edit_inputs flex flex-row">
                        <div className="edit_input1 mx-14 flex flex-col gap-4">
                            <div className="nickname flex flex-col items-start mt-4">
                                <input type="text" placeholder="Nickname" className="personalInfo_inputs" name="nickname" value={personalInfo.nickname} onChange={handleChange} />
                                <label className="personalInfo_labels">Nickname</label>
                            </div>

                            <div className="gender flex flex-col items-start">
                                <input type="text" placeholder="Gender" className="personalInfo_inputs" name="gender" value={personalInfo.gender} onChange={handleChange} />
                                <label className="personalInfo_labels">Gender</label>
                            </div>

                            <div className="studentNumber flex flex-col items-start mb-4">
                                <input type="text" placeholder="Student No." className="personalInfo_inputs" name="studentNumber" value={personalInfo.studentNumber} onChange={handleChange} />
                                <label className="personalInfo_labels">Student Number</label>
                            </div>
                        </div>

                        <div className="edit_input2 mx-14 flex flex-col gap-4">
                            <div className="personalEmail flex flex-col items-start mt-4">
                                <input type="text" placeholder="Personal Email Address" className="personalInfo_inputs" name="personalEmail" value={personalInfo.personalEmail} onChange={handleChange} />
                                <label className="personalInfo_labels">Personal Email Address</label>
                            </div>

                            <div className="mobileNo flex flex-col items-start">
                                <input type="text" placeholder="Mobile Number" className="personalInfo_inputs" name="mobileNumber" value={personalInfo.mobileNumber} onChange={handleChange} />
                                <label className="personalInfo_labels">Mobile Number</label>
                            </div>

                            <div className="course flex flex-col items-start mb-4">
                                <input type="text" placeholder="Course" className="personalInfo_inputs" name="course" value={personalInfo.course} onChange={handleChange} />
                                <label className="personalInfo_labels">Course</label>
                            </div>
                        </div>
                    </div>

                    <button type="button" value="submit" className="updateInformation_btn" onClick={handleUpdate}>Update Information</button>
                </div>
            </div>
        </div>
    );
}

export default PersonalInfo;
