"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "../header/page";
import Footer from "../footer/page";
import "@/app/globals.css";


const AdminApprovalPage = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase.from("Materials").select("*, Users(name)");
    if (error) {
      console.error("Error fetching materials:", error);
    } else {
      setMaterials(data);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
  const { error } = await supabase
    .from("Materials")
    .update({ is_approved: !currentStatus })
    .eq("id", id);

  if (error) {
    console.error("Error updating approval status:", error);
  } else {
    fetchMaterials(); // Refresh the list
  }
  };


  const filteredMaterials = materials
  .filter((material) => {
    const matchesSearch = (material.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "approved" && material.is_approved === true) ||
      (filter === "unapproved" && material.is_approved !== true);
    
    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically


  return (
    <div className="p-6">
    <Header/>
      <h1 className="text-2xl font-bold mb-4">Admin Approval Panel</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search materials by name..."
          className="border p-2 rounded w-full sm:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full sm:w-1/4"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="unapproved">Unapproved</option>
        </select>
      </div>
      <div className="py-6">
        <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
            <tr className="bg-maroon text-white">
                <th className="px-6 py-3 text-left border-b border-gray-300">Name</th>
                <th className="px-6 py-3 text-left border-b border-gray-300">Type</th>
                <th className="px-6 py-3 text-left border-b border-gray-300">Uploader</th>
                <th className="px-6 py-3 text-left border-b border-gray-300">Approval Status</th>
            </tr>
            </thead>
            <tbody>
            {filteredMaterials.map((material) => (
                <tr key={material.id} className="border-t bg-white hover:bg-gray-100 transition">
                <td className="px-6 py-3">{material.title}</td>
                <td className="px-6 py-3">{material.materialType || "None"}</td>
                <td className="px-6 py-3">{material.Users?.name || "Unknown"}</td>
                <td className="px-6 py-3">
                    <button
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                        material.is_approved ? "bg-gold text-black" : "bg-gray-400 text-white"
                    }`}
                    onClick={() => toggleApproval(material.id, material.is_approved)}
                    >
                    {material.is_approved ? "Unapprove" : "Approve"}
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      <Footer/>
    </div>
  );
};

export default AdminApprovalPage;