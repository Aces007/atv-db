"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useWebsiteContext } from "../WebsiteContext";
import Header from "../header/page";
import Footer from "../footer/page";
import { useState } from "react";


const Upload = () => {
    const { handleUploadMaterial } = useWebsiteContext();
    const [authors, setAuthors] = useState([{ firstName: "", lastName: "" }]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const addAuthor = () => {
        setAuthors([...authors, { firstName: "", lastName: "" }]);
    };

    const [materialData, setMaterialData] = useState({
        title: "",
        authors: [{firstName: "", lastName: ""}],
        abstract: "",
        materialType: "",
        publicationDate: {month: "", day: "", year: ""},
        pageCount: "",
        referenceCount: "",
        uploader: { firstName: "", lastName: "", email: "" },
    })

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthdate: { month: "", day: "", year: "",},
    });
    
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);


    const handleAuthorChange = (index, field, value) => {
        setMaterialData((prev) => {
            const updatedAuthors = [...prev.authors];
            updatedAuthors[index][field] = value;
            return { ...prev, authors: updatedAuthors };
        });
    };    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setMaterialData((prev) => {
            if (["month", "day", "year"].includes(name)) {
                return {
                    ...prev,
                    publicationDate: { ...prev.publicationDate, [name]: value },
                };
            } else if (["firstName", "lastName", "email"].includes(name)) {
                return {
                    ...prev,
                    uploader: { ...prev.uploader, [name]: value },
                };
            } else if (name === "materialType") { 
                return {
                    ...prev,
                    materialType: value, 
                };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { year, month, day } = materialData.publicationDate;

        let publicationDate = null;
        if (year && month && day) {
            publicationDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        }

        const finalData = {
            title: materialData.title,
            authors: materialData.authors, // No need to stringify JSONB fields
            abstract: materialData.abstract,
            material_type: materialData.materialType,
            publication_date: publicationDate || null, // Ensure column name matches DB
            page_count: materialData.pageCount ? parseInt(materialData.pageCount, 10) : null,
            reference_count: materialData.referenceCount ? parseInt(materialData.referenceCount, 10) : null,
            uploader: materialData.uploader, // No need to stringify JSONB fields
        };

        console.log("📤 Submitting data:", finalData);

        // 🔥 Use handleUploadMaterial function here!
        await handleUploadMaterial(finalData);
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
                            <input type="text" name="title" placeholder="Title of Material" className="material_inputs" value={materialData.title} onChange={handleInputChange} />
                            <h3 className="submit_instructions">Enter the title of the submitted material (including capitalization).</h3>
                        </div>
                    </div>

                    <div className="material_author">
                        <h2 className="submit_labels">Author(s)</h2>
                        <div className="mx-6 my-4 flex flex-col items-start gap-4">
                            {materialData.authors.map((_, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        className="author_inputs"
                                        value={materialData.authors.firstName} 
                                        onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        className="author_inputs"
                                        value={materialData.authors.lastName} 
                                        onChange={(e) => handleAuthorChange(index, "lastName", e.target.value)}
                                    />
                                </div>
                            ))}
                            <h3 className="submit_instructions">Enter the name of the author/s of the submitted material (including capitalization).</h3>
                            <button type="button" onClick={addAuthor} className="add_author">+ Add Author</button>
                        </div>
                    </div>

                    <div className="material_abstract">
                        <h2 className="submit_labels">Abstract</h2>
                        <textarea name="abstract" id="abstract_input" className="mx-6 my-4" value={materialData.abstract} onChange={handleInputChange} ></textarea>
                    </div>

                    <div className="material_type">
                        <h2 className="submit_labels">Material Type</h2>

                        <div className="material_type_select">
                            <select name="materialType" className="material_drop mx-6 my-4" value={materialData.materialType} onChange={handleInputChange}> 
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
                                <select name="month" value={materialData.publicationDate.month} onChange={handleInputChange} className="material_pub_drop">
                                    <option value="">Month</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>

                                <select name="day" value={materialData.publicationDate.day} onChange={handleInputChange} className="material_pub_drop">
                                    <option value="">Day</option>
                                    {days.map((day, index) => (
                                        <option key={index} value={day}>{day}</option>
                                    ))}
                                </select>

                                <select name="year" value={materialData.publicationDate.year} onChange={handleInputChange} className="material_pub_drop">
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
                                <input type="text"name="pageCount" placeholder="Page Count" className="material_inputs" value={materialData.pageCount} onChange={handleInputChange}/>
                                <h3 className="submit_instructions">Enter the number of pages found in the submitted material.</h3>
                            </div>
                        </div>

                        <div className="material_references mx-6 my-4">
                            <label htmlFor="" className="font-Red_Hat_Display font-medium underline text-min">Number of References</label>

                            <div className="my-4">
                                <input type="text" name="referenceCount" placeholder="References Count" className="material_inputs" value={materialData.referenceCount} onChange={handleInputChange}/>
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
                                name="firstName"
                                placeholder="First Name"
                                className="author_inputs"
                                value={materialData.uploader.firstName} 
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                className="author_inputs"
                                value={materialData.uploader.lastName} 
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Personal Email"
                                className="author_inputs"
                                value={materialData.uploader.email} 
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <button className="submit_material_btn my-6" onClick={handleSubmit}>Submit Material</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Upload;