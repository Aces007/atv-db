    "use client";

    import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
    import Image from "next/image";
    import Link from "next/link";
    import { supabase } from "@/lib/supabaseClient";
    import { useWebsiteContext } from "../WebsiteContext";
    import Header from "../header/page";
    import Footer from "../footer/page";
    import { use, useState } from "react";
    import CitationModal from "../components/CitationModal"; //Citation

    const Upload = () => {
        const [isCitationModalOpen, setIsCitationModalOpen] = useState(false); // Citation
        const { handleUploadMaterial } = useWebsiteContext();
        const [authors, setAuthors] = useState([{ firstName: "", lastName: "" }]);
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [tags, setTags] = useState([]);
        const [tagInput, setTagInput] = useState("");
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
        
        const handleTagInput = (e) => {
            setTagInput(e.target.value);
        }

        const handleTagKeyDown = (e) => {
            if ((e.key === "Enter" || e.key === "," || e.key === " ") && tagInput.trim()) {
                e.preventDefault();
                const newTag = tagInput.trim().replace(/,/g, '')
                if (!tags.includes(newTag)) {
                    setTags((prev) => [...prev, newTag]);
                }
                setTagInput("");
            }
        }

        const removeTag = (indexOfItem) => {
            setTags(tags.filter((_, index) => index !== indexOfItem));
        }


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

        const handleFileUpload = async (event) => {
            const file = event.target.files?.[0];
            if (!file || !file.name) {
                console.error("No valid file selected.");
                return;
            }
        
            const filePath = await uploadPDFToSupabase(file);
            if (!filePath) {
                console.error("Failed to upload file to Supabase");
                return;
            }
        
            console.log("Successfully uploaded:", filePath);
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
                tags,
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
                            <div className="flex flex-col items-start mx-6 my-4 gap-4">
                                <textarea name="abstract" id="abstract_input" value={materialData.abstract} onChange={handleInputChange} ></textarea>
                                <h3 className="submit_instructions">Enter the abstract of the submitted material.</h3>
                            </div>
                        </div>
                        
                        <div className="material_tags">
                            <h2 className="submit_labels">Tags</h2>
                            
                            <div className="tag_cont mx-6 my-4 flex flex-col gap-4">
                                <div className="tag_content">
                                    {tags.map((tag, index) => (
                                        <div key={index} className="tag_items">
                                            <span>{tag}</span>
                                            <button type="button" onClick={() => removeTag(index)} className="tag_remove">x</button>
                                        </div>
                                    ))}

                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={handleTagInput}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Add Tags"
                                        className="tag_inputs"
                                    />
                                </div>
                                <h3 className="submit_instructions">Enter the tags of the submitted material. Type and press `Enter`, `comma` or `space` to add a tag.</h3>
                            </div>
                        </div>

                        <div className="material_type">
                            <h2 className="submit_labels">Material Type</h2>

                            <div className="material_type_select">
                                <select name="materialType" className="material_drop mx-6 my-4" value={materialData.materialType} onChange={handleInputChange}> 
                                    <option value="Article">Article</option>
                                    <option value="Book">Book</option>
                                    <option value="Report">Report</option>
                                    <option value="Thesis">Thesis</option>
                                    <option value="Journal">Journal</option>
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



                    <button type="button" onClick={() => setIsCitationModalOpen(true)} className="add_author"> Generate Citations </button> 
                    <CitationModal // Citation
                        isOpen={isCitationModalOpen}
                        onClose={() => setIsCitationModalOpen(false)}
                        materialData={materialData}
                    />
                </div>
                
                <Footer />
                
            </div>
        )
    }

    export default Upload;