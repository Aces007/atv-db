"use client"

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMobileScreen, faWifi, faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useWebsiteContext } from '../WebsiteContext';
import { supabase } from '@/lib/supabaseClient';


const Login = () => {
    const { handleLogin, loading } = useWebsiteContext();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleSubmit = async (e) => {
            e.preventDefault();
            await handleLogin(email, password)
    }

    return (
        <div className="login_cont">
            <div className="login_columns flex flex-row items-center justify-between">
                <div className="flex flex-col items-center w-full h-screen py-6">
                    <div className="flex flex-col items-center gap-2">
                        <Link href={"https://www.pup.edu.ph/ous/"}>
                            <Image src="/images/materials/openU.png" alt="openULogo" width={140} height={140} />
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
                            <Link href={'./homepage/'}>
                                <Image src="/images/logo.png" alt="ATVLogo" width={140} height={140} />
                            </Link>
                            <h1 className="font-Cinzel font-bold text-3xl text-white tracking-widest">Architech Vault</h1>
                        </div>

                        <form className="user_forms_login" onSubmit={handleSubmit}>
                            <div className="username_input">
                              <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} className="form_fields h-10 w-full p-6 rounded" required/>
                            </div>
                            <div className="password_input relative">
                                <input type={passwordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form_fields h-10 w-full p-6 rounded" required/>

                                <button type="button" onClick={togglePasswordVisibility} className='absolute right-3 top-2/4 transform -translate-y-2/4 mx-4'>
                                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="1x" color="gray" />
                                </button>
                            </div>

                            <div className="form_btns flex flex-row items-center justify-between">
                                <button  type='submit' className="login_btn2">{loading ? "Logging In..." : "Log In"}</button>
                                <Link href={'./signuppage/'}><button className="signup_btn">Sign Up</button></Link>
                            </div>
                            <button className="forgot_pass font-Montserrat text-white text-opacity-90">Forgot Password?</button>
                        </form>
                    </div>

                    <img src="./images/materials/obelisk.jpg" alt="PUP Pylon Image" className="obelisk_img"/>
                </div>
            </div>
        </div>        
    )
}


export default Login;