"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import { useWebsiteContext } from "../WebsiteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPaintRoller } from "@fortawesome/free-solid-svg-icons";


const Footer = () => {
    return (
        <div className="foot_cont">
            <div className="foot_content flex flex-row justify-around">
                <div className="foot_links flex flex-row gap-28 justify-around">
                    <div className="quick_links flex flex-col items-start gap-6">
                        <h1 className="font-Red_Hat_Display font-bold text-white">QUICK LINKS</h1>

                        <div className="link_list flex flex-col justify-evenly gap-3">
                            <a href={'./aboutpage/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">About ATV</a>
                            <a href={'https://www.pup.edu.ph/about/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">About PUP</a>
                            <a href={'https://www.pup.edu.ph/ous/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP OUS</a>
                            <a href={'https://sis8.pup.edu.ph/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP SIS</a>
                            <a href={'https://emabini.pup.edu.ph/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP eMabini</a>
                        </div>
                    </div>

                    <div className="online_serv flex flex-col items-start gap-6">
                        <h1 className="font-Red_Hat_Display font-bold text-white">ONLINE SERVICES</h1>

                        <div className="link_list flex flex-col justify-evenly gap-3">
                            <a href={'https://pupsinta.freshservice.com/support/home'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP SINTA</a>
                            <a href={'https://outlook.office.com/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP WebMail</a>
                            <a href={'http://www.pup.edu.ph/iapply/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">PUP iApply</a>
                            <a href={'https://www.pup.edu.ph/jobpost/'} className="font-Red_Hat_Display font-medium text-white text-opacity-80">Jobs for PUPians</a>
                        </div>
                    </div>
                </div>

                <div className="foot_logo flex flex-col items-center gap-6">
                    <Link href={'./homepage/'}><img src="./images/logo.png" alt="ATV Logo" className="logo_footer"/></Link>

                    <Link href={'./homepage/'}>
                        <h1 className="font-Cinzel font-black text-white text-opacity-80 tracking-widest text-sm">ARCHITECH VAULT</h1>
                    </Link>

                    <p className="font-Red_Hat_Display text-white text-opacity-60 uppercase text-min">© 1998-2025 Polytechnic University of the Philippines</p>
                </div>

                <div className="foot_contact flex flex-col items-start gap-6">
                    <h1 className="font-Red_Hat_Display font-bold text-white">CONTACT US</h1>

                    <div className="link_list flex flex-col justify-evenly gap-3">
                        <p className="font-Red_Hat_Display font-medium text-white text-opacity-80"><span className="font-Red_Hat_Display font-bold text-white text-opacity-80">Phone:</span> (+63 2) 5335-1PUP (5335-1787) or 5335-1777</p>
                        <p className="font-Red_Hat_Display font-medium text-white text-opacity-80"><span className="font-Red_Hat_Display font-bold text-white text-opacity-80">Email:</span> inquire@pup.edu.ph</p>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;