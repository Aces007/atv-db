"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownMenu } from "@nextui-org/dropdown";
import Header from '../header/page';
import Footer from "../footer/page";

const MyForm = () => {
    const [topics, setTopics] = useState([]); // Store the list of topics
    const [inputValue, setInputValue] = useState(""); // Store current input

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // Prevent form submission or typing a comma
            const trimmedValue = inputValue.trim();

            // Ensure the value is not empty and not already added
            if (trimmedValue && !topics.includes(trimmedValue)) {
                setTopics([...topics, trimmedValue]);
                setInputValue(""); // Clear input after adding
            }
        }
    };

    const handleRemove = (index) => {
        setTopics(topics.filter((_, i) => i !== index)); // Remove clicked topic
    };

    return (
        <form>
            <label> Title: </label>
            <input type='text' style={{ border: "1px solid red", padding: "5px", display: "block" }} />
            <input type='file' />
            <label> Date of Publication: </label>
            <input type='date' />
            <label htmlFor="pup-open-university-courses"> Choose a course:</label>
            <select id="pup-open-university-courses" name="pup-open-university-courses">
                <option value="" disabled selected> Select your course </option>
                <option value="bs_accountancy">Bachelor of Science in Accountancy</option>
                <option value="bs_business_admin">Bachelor of Science in Business Administration</option>
                <option value="bs_education">Bachelor of Science in Education</option>
                <option value="bs_information_technology">Bachelor of Science in Information Technology</option>
                <option value="bs_public_administration">Bachelor of Science in Public Administration</option>
                <option value="bs_office_administration">Bachelor of Science in Office Administration</option>
                <option value="bs_psychology">Bachelor of Science in Psychology</option>
                <option value="bs_hospitality_management">Bachelor of Science in Hospitality Management</option>
                <option value="bs_tourism_management">Bachelor of Science in Tourism Management</option>
                <option value="bs_social_work">Bachelor of Science in Social Work</option>
                <option value="bs_criminology">Bachelor of Science in Criminology</option>
                <option value="bs_library_science">Bachelor of Science in Library and Information Science</option>
                <option value="bs_communications">Bachelor of Science in Development Communication</option>
                <option value="bs_journalism">Bachelor of Science in Journalism</option>
                <option value="bs_advertising">Bachelor of Science in Advertising and Public Relations</option>
                <option value="bs_broadcasting">Bachelor of Science in Broadcasting</option>
                <option value="bs_education_secondary">Bachelor of Science in Secondary Education</option>
            </select>

            <label> Topics: </label>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                border: "1px solid gray",
                padding: "5px",
                borderRadius: "5px",
                minHeight: "40px",
                alignItems: "center"
            }}>
                {topics.map((topic, index) => (
                    <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#e0e0e0",
                        padding: "5px 10px",
                        margin: "5px",
                        borderRadius: "20px"
                    }}>
                        {topic}
                        <button type="button" onClick={() => handleRemove(index)} style={{
                            marginLeft: "8px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer"
                        }}>×</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter topics, press Enter or comma"
                    style={{
                        border: "none",
                        outline: "none",
                        flex: 1,
                        minWidth: "100px",
                        padding: "5px"
                    }}
                />
            </div>
        </form>
    );
};

const SearchResults = () => {
    return (
        <div className='search_cont'>
            <div className="search_content">
                <Header />

                <div className="banner_cont">
                    <img src="/images/materials/pup_mural.png" alt="PUP Mural" className="mural_img" />

                    <div className="banner_content p-8 flex flex-col items-center justify-around gap-28 w-screen">
                        <h1 className="right_txt font-Cinzel font-black uppercase text-med text-white opacity-80">
                            Open Minds with Open Access
                        </h1>

                        <div className="search_bar_cont relative">
                            <div className="search_bar_content flex flex-row">
                                <div className="dropdown">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <div className="drop_btn flex flex-row items-center gap-min py-med px-lg border cursor-pointer">
                                                <Image src="/images/materials/SVGs/down.svg" alt="dropdownBtn" width={30} height={30} />
                                                <p className="drop_btnTxt font-Montserrat text-black">All Fields</p>
                                            </div>
                                        </DropdownTrigger>
                                        <DropdownMenu className="drop_menu" aria-label="Filter Options"></DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="search_field">
                                    <input type="text" placeholder="What are you looking for?..." className="search_field_bar h-med p-lg" />
                                </div>
                                <div className="search_btn">
                                    <Link href={'./searchresults/'}>
                                        <button className="searchBtn">
                                            <Image src="/images/materials/SVGs/search.svg" alt="searchBtn" width={30} height={30} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ensure the form is inside the file_upload div */}
            <div className="file_upload" style={{ margin: "50px" }}>
                <MyForm />
            </div>

            <Footer />
        </div>
    );
}

export default SearchResults;
