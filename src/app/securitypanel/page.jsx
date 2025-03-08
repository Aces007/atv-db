"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";


const Security = () => {
    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="edit_security">
                    <h2 className="securityInfo_label">Security</h2>

                    <div className="change_pass">
                        <h3 className="changePass_label">Change Password</h3>

                        <div className="password_inputs">
                            <div className="password flex flex-col items-start mt-4">
                                <input type="password" placeholder="Password" className="personalInfo_inputs"/>
                                <label className="personalInfo_labels">Password</label>
                            </div>
                            
                            
                            <div className="confirm_password flex flex-col items-start mt-4">
                                <input type="password" placeholder="Confirm Password" className="personalInfo_inputs"/>
                                <label className="personalInfo_labels">Confirm Password</label>
                            </div>

                            <div className="flex flex-row items-center gap-10 mt-8">
                                <p>Password Strength</p>

                                <button className="updatePassword_btn">Update Password</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default Security;