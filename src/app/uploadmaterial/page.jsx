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
    
    const addAuthor = () => {
        setMaterialData((prev) => ({
            ...prev,
            authors: [...prev.authors, { firstName: "", lastName: "" }]
        }));
    };
    
    // For the Date Field
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
    

    // Extracting Data from PDF & integration to fields
    const extractFieldsFromPDF = async (text) => {
        try {
            console.log("Raw AI Response:", text); 
    
            let extractedData;
            try {
                extractedData = JSON.parse(text);
            } catch (error) {
                console.error("Error parsing AI response:", error);
                return;
            }
    
            console.log("Extracted Data:", extractedData);
    
            setMaterialData((prev) => ({
                ...prev,
                title: extractedData.title || prev.title,
                authors: extractedData.authors || prev.authors,
                abstract: extractedData.abstract || prev.abstract,
                materialType: extractedData.materialType || prev.materialType,
            }));
    
            console.log("Form Updated Successfully!");
        } catch (error) {
            console.error("Error extracting fields:", error);
        }
    };
    
    
    // Uploading PDF function
    const uploadPDFToSupabase = async (file) => {
        try {
            console.log("Uploading PDF:", file.name);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `pdfs/${fileName}`

            console.log("File Uploaded is: ", filePath)
    
            const { data, error } = await supabase.storage
                .from("pdfs")  
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
    
            if (error) {
                console.error("Supabase Upload Error:", error);
                return null;
            }
    
            console.log("Upload successful. File path:", data.path);
            return data.path;
        } catch (err) {
            console.error("Unexpected error in uploadPDFToSupabase:", err);
            return null;
        }
    };
    


    // Uploading PDF and fields
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const filePath = await uploadPDFToSupabase(file);
        if (!filePath) {
            console.error("Failed to upload file to Supabase");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("/api/geminiAI", {
                method: "POST",
                body: formData,
            });
    
            // Debugging: Check if response is actually JSON
            const contentType = response.headers.get("content-type");
            console.log("Response Content-Type:", contentType);
    
            const responseText = await response.text();
            console.log("Raw response from API:", responseText);
    
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Invalid response format. Expected JSON.");
                return;
            }
    
            const data = JSON.parse(responseText);
            console.log("Parsed JSON Response:", data);
    
            if (!data.extractedText) {
                console.error("No text extracted from PDF");
                return;
            }
    
            console.log("Extracted PDF Text:", data.extractedText);
            console.log("GeminiAI Response:", data.aiResult);
    
            if (data.aiResult) {
                extractFieldsFromPDF(data.aiResult);
            } else {
                console.error("Invalid AI response:", data);
            }
    
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    
    
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { year, month, day } = materialData.publicationDate;
        
        // Convert month name to a number
        const monthIndex = months.indexOf(month) + 1; 
    
        const formattedPublicationDate = year && monthIndex && day
            ? `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : null;
    
        const finalData = {
            ...materialData,
            publicationDate: formattedPublicationDate, 
        };
    
        console.log("Submitting Data:", finalData);
    
        await handleUploadMaterial(finalData);
    };
    
    
    
    return (
        <div className="uploadMaterial_cont">
            <Header />

            <h1 className="font-Red_Hat_Display uppercase font-black text-sm mx-10">Submit Material</h1>
            <div className="uploadMaterial_content">
                <form action="submit" onSubmit={handleSubmit}>
                    <div className="material_upload">
                        <h2 className="submit_labels">Upload Material</h2>

                        <div className="mx-6 my-4 flex flex-row items-center gap-4">
                            <input placeholder="Upload" type="file" accept="application/pdf" onChange={handleFileUpload} className="upload_material_btn" />
                            <h3 className="submit_instructions">Use this to find material to be submitted.</h3>
                        </div>
                    </div>

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
                                        value={materialData.authors[index].firstName} 
                                        onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        className="author_inputs"
                                        value={materialData.authors[index].lastName} 
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

                    <button type="submit" className="submit_material_btn my-6">Submit Material</button>
                </form>


                <button type="button" onClick={addAuthor} className="add_author">" Cite </button>
                    {materialData.authors.map((author, index) => (
                    <span key={index}>
                        {author.lastName}, {author.firstName.charAt(0)}.
                        {index !== materialData.authors.length - 1 ? ", " : ""}
                    </span>
                    ))}
                    ({materialData.publicationDate.year}) {materialData.title}

            </div>
            <Footer />
        </div>
    )
}

export default Upload;