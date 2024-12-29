"use client"

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMobileScreen, faWifi, faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [date, setDate] = useState({ month: "", day: "", year: "" })
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDate({ ...date, [name]: value });
    }



    return (
        <div className="login_cont">
            <div className="login_columns flex flex-row items-center justify-between">
                <div className="flex flex-col items-center w-full h-screen py-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link href={"https://www.pup.edu.ph/ous/"}>
                            <Image src="/images/materials/openU.png" alt="ATVLogo" width={140} height={140} />
                        </Link>
                        <h1 className="font-Cinzel font-bold text-3xl tracking-widest">“Mula Sa ‘yo, Para sa Bayan”</h1>
                    </div>

                    <div className="flex flex-col mt-6 gap-6">
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faGlobe} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Global</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faMobileScreen} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Mobile Friendly</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faWifi} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Virtual Learning</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faCheck} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Learn and Work</p>
                        </div>
                    </div>
                </div>

                <div className="login_panel flex flex-col items-center w-full h-screen py-6">
                    <div className="login_content">
                        <div className="flex flex-col items-center gap-2">
                            <Image src="/images/logo.png" alt="openULogo" width={140} height={140} />
                            <h1 className="font-Cinzel font-bold text-3xl text-white tracking-widest">Architech Vault</h1>
                        </div>

                        <form className="user_forms_signup">
                            <div className="email_input">
                              <input type="text" placeholder="PUP Email" className="form_fields h-4 w-full p-5 rounded" />
                            </div>
                            <div className="password_input relative">
                                <input type={passwordVisible ? "text" : "password"} placeholder="Password" className="form_fields h-4 w-full p-5 rounded" />

                                <button type="button" onClick={togglePasswordVisibility} className='absolute right-3 top-2/4 transform -translate-y-2/4 mx-4'>
                                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="1x" color="gray" />
                                </button>
                            </div>
                            
                            <div className="password_input relative">
                                <input type={passwordVisible ? "text" : "password"} placeholder="Confirm Password" className="form_fields h-4 w-full p-5 rounded" />

                                <button type="button" onClick={togglePasswordVisibility} className='absolute right-3 top-2/4 transform -translate-y-2/4 mx-4'>
                                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="1x" color="gray" />
                                </button>
                            </div>

                            <div className='flex flex-row justify-around gap-10'>
                                <select name="month" value={date.month} onChange={handleDateChange} className="date_dropdown">
                                    <option value="">Month</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>

                                <select name="day" value={date.day} onChange={handleDateChange} className="date_dropdown">
                                    <option value="">Day</option>
                                    {days.map((day, index) => (
                                        <option key={index} value={day}>{day}</option>
                                    ))}
                                </select>

                                <select name="year" value={date.year} onChange={handleDateChange} className="date_dropdown">
                                <option value="">Year</option>
                                    {years.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div className='flex flex-row items-center justify-between gap-2'>
                                <button className="signup_btn">Sign Up</button>
                                <Link href={"https://sis1.pup.edu.ph/"}><button className="sis_btn">PUP-SIS</button></Link>
                            </div>
                        </form>
                    </div>

                    <img src="./images/materials/obelisk.jpg" alt="PUP Pylon Image" className="obelisk_img"/>
                </div>
            </div>
        </div>        
    )
}


export default SignUp;