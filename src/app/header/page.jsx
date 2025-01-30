"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <div className="header px-max py-lg flex flex-row items-center justify-between">
            <div className="header_left">
                <Link href={'./homepage/'}><img src="./images/logo.png" alt="ATV Logo" className="logo_img"/></Link>
                <div className="logo_txt flex flex-col relative top-2">
                    <a href="#">
                        <h1 className="logo_h1 uppercase text-black">Architech Vault</h1>
                    </a>
                    <a href="#">
                        <h2 className="logo_h2 uppercase text-black">Pup Open University</h2>
                    </a>
                </div>
            </div>

            <div className="header_right flex flex-row items-center gap-max">
                <a href={'./aboutpage/'} className="about_btns font-Montserrat font-bold uppercase">About</a>
                <a href="https://www.pup.edu.ph/ous/" target="_blank" className="about_btns font-Montserrat font-bold uppercase">PUP OUS</a>
                <Link href={'./loginpage/'}><button className="login_btn px-lg py-sm font-Montserrat font-bold">LOGIN</button></Link>
            </div>
        </div>
    )
};

export default Header;