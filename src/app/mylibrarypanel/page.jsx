"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faGlobe, faBook } from "@fortawesome/free-solid-svg-icons";


const MyLibrary = () => {
    return (
        <div className="info_cont">
            <div className="info_content">
                <div className="my_library">
                    <h2 className="libraryInfo_label">My Library</h2>

                    <div className="upload_data flex flex-row justify-between">
                        <div>
                            <h3 className="upload_label">Uploads</h3>
                        </div>

                        <div>
                            <button className="upload_btn">Upload New</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyLibrary;