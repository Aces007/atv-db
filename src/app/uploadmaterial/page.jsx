"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useWebsiteContext } from "../WebsiteContext";
import Header from "../header/page";
import Footer from "../footer/page";
import { useState } from "react";

const Upload = () => {
  const { handleUploadMaterial } = useWebsiteContext();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [references, setReferences] = useState([{ citation: "", url: "" }]);

  const [materialData, setMaterialData] = useState({
    title: "",
    url: "",
    authors: [{ firstName: "", lastName: "", authorEmail: "", }],
    abstract: "",
    materialType: "",
    publicationDate: { month: "", day: "", year: "" },
    pageCount: "",
    referenceCount: "",
    uploader: { firstName: "", lastName: "", email: "" },
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const addAuthor = () => {
    setMaterialData((prev) => ({
      ...prev,
      authors: [...prev.authors, { firstName: "", lastName: "", authorEmail: "", }],
    }));
  };

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
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleTagInput = (e) => setTagInput(e.target.value);

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (!tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const uploadPDFToSupabase = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

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

      return data.path;
    } catch (err) {
      console.error("Unexpected error in uploadPDFToSupabase:", err);
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.name) return;

    const filePath = await uploadPDFToSupabase(file);
    if (!filePath) return;

    console.log("Successfully uploaded:", filePath);
  };

  const addReference = () => {
    setReferences((prev) => [...prev, { citation: "", url: "" }]);
  };

  const handleReferenceChange = (index, field, value) => {
    setReferences((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { year, month, day } = materialData.publicationDate;
    const monthIndex = months.indexOf(month) + 1;

    const formattedPublicationDate =
      year && monthIndex && day
        ? `${year}-${String(monthIndex).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        : null;

    const citationsArray = references.map((ref) => ref.citation);
    const urlsArray = references.map((ref) => ref.url);

    // Get current user ID from Supabase auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user or user not logged in:", userError);
      alert("You must be logged in to submit material.");
      return;
    }

    const finalData = {
      ...materialData,
      tags,
      references: citationsArray,
      url: urlsArray,
      publicationDate: formattedPublicationDate,
      user_id: user.id, // Add user id here to link the article to uploader
    };

    console.log("Submitting Data:", finalData);

    await handleUploadMaterial(finalData);
  };

  return (
    <div className="uploadMaterial_cont bg-[#fafaf9] min-h-screen">
      <Header />
      <div className="w-full px-4 md:px-10 py-10">
        <h1 className="font-Red_Hat_Display uppercase font-black text-3xl mb-6 text-black">Submit Material</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Upload Material */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Upload Material</h2>
            <div className="flex items-center gap-4">
              <input type="file" accept="application/pdf" onChange={handleFileUpload} className="upload_material_btn" />
              <p className="submit_instructions">Use this to find the material to be uploaded.</p>
            </div>
          </div>

          {/* Title */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Title of Material</h2>
            <input
              type="text"
              name="title"
              placeholder="Title of Material"
              className="material_inputs w-full mt-2"
              value={materialData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Authors */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Author(s)</h2>
            {materialData.authors.map((_, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2">
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
                <input
                  type="text"
                  name="authorEmail"
                  placeholder="Author's Email"
                  className="author_inputs"
                  value={materialData.authors[index].authorEmail}
                  onChange={(e) => handleAuthorChange(index, "authorEmail", e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addAuthor} className="add_author mt-4">+ Add Author</button>
          </div>

          {/* Abstract */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Abstract</h2>
            <textarea
              name="abstract"
              value={materialData.abstract}
              onChange={handleInputChange}
              className="w-full h-32 mt-2 p-2 border rounded"
            />
          </div>

          {/* Introduction */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Introduction</h2>
            <textarea
              name="introduction"
              value={materialData.introduction}
              onChange={handleInputChange}
              className="w-full h-32 mt-2 p-2 border rounded"
            />
          </div>

          {/* Tags */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-2">
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
          </div>

          {/* Material Type */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Material Type</h2>
            <select
              name="materialType"
              className="material_inputs"
              value={materialData.materialType}
              onChange={handleInputChange}
            >
              <option value="">Select a type</option>
              <option value="Article">Article</option>
              <option value="Book">Book</option>
              <option value="Report">Report</option>
              <option value="Thesis">Thesis</option>
              <option value="Journal">Journal</option>
            </select>
          </div>

          {/* Publication Date */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Publication Date</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <select name="month" value={materialData.publicationDate.month} onChange={handleInputChange} className="material_inputs">
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select name="day" value={materialData.publicationDate.day} onChange={handleInputChange} className="material_inputs">
                <option value="">Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <select name="year" value={materialData.publicationDate.year} onChange={handleInputChange} className="material_inputs">
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Page Count */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Page Count</h2>
            <input
              type="number"
              name="pageCount"
              value={materialData.pageCount}
              onChange={handleInputChange}
              placeholder="Enter page count"
              className="material_inputs w-full mt-2"
            />
            <h3 className="submit_instructions mt-2">
              Enter the number of pages found in the submitted material.
            </h3>
          </div>

          {/* Reference Count */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md mt-6">
            <h2 className="submit_labels">Number of References</h2>
            <input
              type="number"
              name="referenceCount"
              value={materialData.referenceCount}
              onChange={handleInputChange}
              placeholder="Enter reference count"
              className="material_inputs w-full mt-2"
            />
            <h3 className="submit_instructions mt-2">
              Enter the number of references used in relation to the submitted material.
            </h3>
          </div>

          {/* References */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">References</h2>
            {references.map((ref, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="APA Citation"
                  value={ref.citation}
                  onChange={(e) => handleReferenceChange(index, "citation", e.target.value)}
                  className="material_inputs"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={ref.url}
                  onChange={(e) => handleReferenceChange(index, "url", e.target.value)}
                  className="material_inputs"
                />
              </div>
            ))}
            <button type="button" onClick={addReference} className="add_author mt-4">+ Add Reference</button>
          </div>

          {/* Uploader Info */}
          <div className="bg-white w-full p-6 rounded-lg shadow-md">
            <h2 className="submit_labels">Your Info</h2>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mt-2">
              <input type="text" name="firstName" value={materialData.uploader.firstName} onChange={handleInputChange} placeholder="First Name" className="material_inputs" />
              <input type="text" name="lastName" value={materialData.uploader.lastName} onChange={handleInputChange} placeholder="Last Name" className="material_inputs" />
              <input type="email" name="email" value={materialData.uploader.email} onChange={handleInputChange} placeholder="Uploader's Email" className="material_inputs" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button type="submit" className="submit_material_btn">Submit Material</button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;

