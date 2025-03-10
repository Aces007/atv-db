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

                    </div>

                    <div className="material_details">

                    </div>

                    <div className="material_upload">

                    </div>

                    <div className="uploader_contact">

                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Upload;