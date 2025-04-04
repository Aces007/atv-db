"use client"

import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMobileScreen, faWifi, faCheck, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { supabase } from '@/lib/supabaseClient';
import { useWebsiteContext } from '../WebsiteContext';



const SignUp = () => {
    const { handleSignup, loading } = useWebsiteContext();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthdate: { month: "", day: "", year: "",},
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "month" || name === "day" || name === "year") {
            setFormData((prev) => ({
                ...prev, 
                birthdate: { ...prev.birthdate, [name]: value },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };    

    const calculateAge = (year, month, day) => {
        if (!year || !month || !day) {
            console.error("Invalid birthdate input:", { year, month, day });
            return null; // Return null if any value is missing
        }
    
        // Convert inputs to integers to avoid unexpected issues
        const yearInt = parseInt(year, 10);
        const monthInt = parseInt(month, 10);
        const dayInt = parseInt(day, 10);
    
        if (isNaN(yearInt) || isNaN(monthInt) || isNaN(dayInt)) {
            console.error("Invalid number format:", { year, month, day });
            return null;
        }
    
        const birthDate = new Date(yearInt, monthInt - 1, dayInt);
        const today = new Date();
    
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--; 
        }
    
        console.log("Calculated Age:", age); // Debugging log
        return age;
    };
    
    

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        const { name, email, password, confirmPassword, birthdate } = formData || {};
        const { month, day, year } = birthdate || {};
    
        console.log("Birthdate values before validation:", { year, month, day });
    
        if (!name || !email || !password || !confirmPassword || !month || !day || !year) {
            setError("All fields are required.");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        const months = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };
    
        const yearInt = parseInt(year, 10);
        const monthInt = months[month] || parseInt(month, 10);
        const dayInt = parseInt(day, 10);
    
        if (isNaN(yearInt) || isNaN(monthInt) || isNaN(dayInt)) {
            console.error("Invalid number format after conversion:", { yearInt, monthInt, dayInt });
            setError("Invalid birthdate. Please enter a valid date.");
            return;
        }
    
        console.log("Final Birthdate values:", { yearInt, monthInt, dayInt });
    
        const age = calculateAge(yearInt, monthInt, dayInt);
        console.log("Calculated Age:", age);
    
        if (age === null || isNaN(age)) {
            setError("Invalid birthdate. Please enter a valid date.");
            return;
        }
    
        await handleSignup(name, email, password, monthInt, dayInt, yearInt, age);
    };

    
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

                <div className="login_panel flex flex-col items-center w-full h-screen py-2">
                    <div className="login_content">
                        <div className="flex flex-col items-center gap-2">
                            <Image src="/images/logo.png" alt="openULogo" width={140} height={140} />
                            <h1 className="font-Cinzel font-bold text-3xl text-white tracking-widest">Architech Vault</h1>
                        </div>

                        <form className="user_forms_signup" onSubmit={onSubmit}>
                            <div className="name_input">
                              <input type="text" placeholder="User Name" name='name' className="form_fields h-4 w-full p-5 rounded" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="email_input">
                              <input type="text" placeholder="PUP Email" name='email' className="form_fields h-4 w-full p-5 rounded" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="password_input relative">
                                <input type={passwordVisible ? "text" : "password"} placeholder="Password" name='password' className="form_fields h-4 w-full p-5 rounded" value={formData.password} onChange={handleInputChange} />

                                <button type="button" onClick={togglePasswordVisibility} className='absolute right-3 top-2/4 transform -translate-y-2/4 mx-4'>
                                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="1x" color="gray" />
                                </button>
                            </div>
                            
                            <div className="password_input relative">
                                <input type={passwordVisible ? "text" : "password"} placeholder="Confirm Password" name='confirmPassword' className="form_fields h-4 w-full p-5 rounded" value={formData.confirmPassword} onChange={handleInputChange} />

                                <button type="button" onClick={togglePasswordVisibility} className='absolute right-3 top-2/4 transform -translate-y-2/4 mx-4'>
                                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size="1x" color="gray" />
                                </button>
                            </div>

                            <div className='flex flex-row justify-around gap-10'>
                                <select name="month" value={formData.birthdate.month} onChange={handleInputChange} className="date_dropdown">
                                    <option value="">Month</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>

                                <select name="day" value={formData.birthdate.day} onChange={handleInputChange} className="date_dropdown">
                                    <option value="">Day</option>
                                    {days.map((day, index) => (
                                        <option key={index} value={day}>{day}</option>
                                    ))}
                                </select>

                                <select name="year" value={formData.birthdate.year} onChange={handleInputChange} className="date_dropdown">
                                <option value="">Year</option>
                                    {years.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            
                            <div className='flex flex-row items-center justify-between gap-2'>
                                <button className="signup_btn" type='submit' disabled={loading} >Sign Up</button>
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