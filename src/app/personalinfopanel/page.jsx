"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";


const PersonalInfo = () => {
    return (
        <div className="profile_panel">
            <div className="profilePanel_content">
                <div className="edit_profile">
                    <img src="/images/materials/streetart.jpg" alt="PUP Street Art" className="street_art" />

                    <div className="info_content">
                        <div className="info_preview">
                            
                        </div>

                        <div className="edit_profile">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo;