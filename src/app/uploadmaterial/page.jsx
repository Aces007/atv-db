"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import { useWebsiteContext } from "../WebsiteContext";
import Header from "../header/page";
import Footer from "../footer/page";
import { useState } from "react";


const Upload = () => {
    const [authors, setAuthors] = useState([{ firstName: "", lastName: "" }]);

    const addAuthor = () => {
        setAuthors([...authors, { firstName: "", lastName: "" }]);
    };

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
    return (
        <div className="uploadMaterial_cont">
            <Header />

            <h1 className="font-Red_Hat_Display uppercase font-black text-sm mx-10">Submit Material</h1>
            <div className="uploadMaterial_content">
                <form action="submit">

                    <div className="material_title">
                        <h2 className="submit_labels">Title of Material</h2>
                        <div className="mx-6 my-4">
                            <input type="text" placeholder="Title of Material" className="material_inputs" />
                            <h3 className="submit_instructions">Enter the title of the submitted material (including capitalization).</h3>
                        </div>
                    </div>

                    <div className="material_author">
                        <h2 className="submit_labels">Author(s)</h2>
                        <div className="mx-6 my-4 flex flex-col items-start gap-4">
                            {authors.map((_, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="author_inputs"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="author_inputs"
                                    />
                                </div>
                            ))}
                            <h3 className="submit_instructions">Enter the name of the author/s of the submitted material (including capitalization).</h3>
                            <button type="button" onClick={addAuthor} className="add_author">+ Add Author</button>
                        </div>
                    </div>

                    <div className="material_abstract">
                        <h2 className="submit_labels">Abstract</h2>
                        <textarea name="Abstract" id="abstract_input" className="mx-6 my-4"></textarea>
                    </div>

                    <div className="material_type">
                        <h2 className="submit_labels">Material Type</h2>

                        <div className="material_type_select">
                            <select name="Material Type" className="material_drop mx-6 my-4">
                                <option value="Article">Article</option>
                                <option value="Book">Book</option>
                                <option value="Report">Report</option>
                                <option value="Thesis">Thesis</option>
                            </select>
                        </div>
                    </div>

                    <div className="material_details">
                        <h2 className="submit_labels">Material Details</h2>

                        <div className="material_pubDate mx-6 my-4">
                            <label htmlFor="" className="font-Red_Hat_Display font-medium underline text-min">Publication Date</label>

                            <div className='flex flex-row justify-around gap-10 my-4'>
                                <select name="month" value={formData.birthdate.month} onChange={handleInputChange} className="material_pub_drop">
                                    <option value="">Month</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>

                                <select name="day" value={formData.birthdate.day} onChange={handleInputChange} className="material_pub_drop">
                                    <option value="">Day</option>
                                    {days.map((day, index) => (
                                        <option key={index} value={day}>{day}</option>
                                    ))}
                                </select>

                                <select name="year" value={formData.birthdate.year} onChange={handleInputChange} className="material_pub_drop">
                                <option value="">Year</option>
                                    {years.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="material_pageCount mx-6 my-4">
                            <label htmlFor="" className="font-Red_Hat_Display font-medium underline text-min">Page Count</label>

                            <div className="my-4">
                                <input type="text" placeholder="Page Count" className="material_inputs" />
                                <h3 className="submit_instructions">Enter the number of pages found in the submitted material.</h3>
                            </div>
                        </div>

                        <div className="material_references mx-6 my-4">
                            <label htmlFor="" className="font-Red_Hat_Display font-medium underline text-min">Number of References</label>

                            <div className="my-4">
                                <input type="text" placeholder="References Count" className="material_inputs" />
                                <h3 className="submit_instructions">Enter the number of references used in relation to the submitted material.</h3>
                            </div>
                        </div>
                    </div>

                    <div className="material_upload">
                        <h2 className="submit_labels">Upload Material</h2>

                        <div className="mx-6 my-4 flex flex-row items-center gap-4">
                            <button className="upload_material_btn">Upload</button>
                            <h3 className="submit_instructions">Use this to find material to be submitted.</h3>
                        </div>
                    </div>

                    <div className="uploader_contact">
                        <h2 className="submit_labels">Your Contact Details</h2>

                        <div className="flex flex-col gap-2 mx-6 my-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="author_inputs"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="author_inputs"
                            />
                            <input
                                type="text"
                                placeholder="Personal Email"
                                className="author_inputs"
                            />
                        </div>
                    </div>
                    <button className="submit_material_btn my-6">Submit Material</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Upload;