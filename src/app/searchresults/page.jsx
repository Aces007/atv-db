"use client";

import { useState, useEffect } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import { Dropdown, DropdownTrigger, DropdownMenu } from "@nextui-org/dropdown";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons"; // Filled star
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons"; // Outline star


const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(""); // Store current input value
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedTitles, setBookmarkedTitles] = useState([]);


  const handleBookmark = async (item) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      alert("Please sign in to save bookmarks.");
      return;
    }
  
    const isBookmarked = bookmarkedTitles.includes(item.title);
  
    try {
      if (isBookmarked) {
        // Unbookmark: remove from Supabase
        const { error } = await supabase
          .from("Bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("title", item.title);
  
        if (error) throw error;
  
        // Remove from local state
        setBookmarks(bookmarks.filter((b) => b.title !== item.title));
        setBookmarkedTitles(bookmarkedTitles.filter((t) => t !== item.title));

        alert("Removed bookmark");
      } else {
        // Bookmark: add to Supabase
        const { error } = await supabase.from("Bookmarks").insert([
          {
            user_id: user.id,
            title: item.title,
            abstract: item.abstract || null,
          },
        ]);
  
        if (error) throw error;
  
        // Add to local state
        setBookmarks([...bookmarks, item]);
        setBookmarkedTitles([...bookmarkedTitles, item.title]);

        alert("Bookmarked successfully");
      }
    } catch (err) {
      console.error("Bookmarking error:", err.message);
      alert("Failed to update bookmark.");
    }
  };
  

  // Fetch materials data from Supabase
  const fetchMaterialsData = async (query) => {
    if (!query.trim()) {
      setResults([]); // Clear previous results if no search term
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Materials")
        .select("title")
        .ilike("title", `%${query}%`);

      if (error) {
        console.error("Error fetching materials:", error.message || error);
        setLoading(false);
        return;
      }

      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchBookmarks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (user) {
        const { data, error } = await supabase
          .from("Bookmarks")
          .select("*")
          .eq("user_id", user.id);
    
        if (!error && data) {
          setBookmarks(data);
          setBookmarkedTitles(data.map((b) => b.title));
        }
      }
    };
  
    fetchBookmarks();
  }, []);
  
  
  useEffect(() => {
    if (inputValue.trim()) {
      fetchMaterialsData(inputValue); // Fetch results when the input has a value
    } else {
      setResults([]); // Clear results if no input
      setLoading(false);
    }
  }, [inputValue]); // Depend on inputValue to trigger fetch when it changes

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        fetchMaterialsData(trimmedValue); // Fetch results only for non-empty values
      }
    }
  };

  return (
    <div className="search_cont">
      <div className="search_content">
        <Header />

        <div className="banner_cont">
          <img
            src="/images/materials/pup_mural.png"
            alt="PUP Mural"
            className="mural_img"
          />
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
                        <Image
                          src="/images/materials/SVGs/down.svg"
                          alt="dropdownBtn"
                          width={30}
                          height={30}
                        />
                        <p className="drop_btnTxt font-Montserrat text-black">
                          All Fields
                        </p>
                      </div>
                    </DropdownTrigger>
                    <DropdownMenu className="drop_menu" aria-label="Filter Options">
                      {/* Add dropdown options here */}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="search_field">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="search_field_bar h-med p-lg"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="search_btn">
                  <Link href="/searchresults">
                    <button className="searchBtn">
                      <Image
                        src="/images/materials/SVGs/search.svg"
                        alt="searchBtn"
                        width={30}
                        height={30}
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="file_upload" style={{ margin: "50px" }}>
        <div
          className="results_container"
          style={{
            margin: "20px 50px",
            padding: "20px",
            background: "#f9f9f9",
            borderRadius: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Search Results:</h3>
          {loading ? (
            <p>Loading results...</p>
          ) : results.length > 0 ? (
            results.map((res, index) => (
              <div
              key={index}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                position: "relative", // for icon placement
              }}
            >
              <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
                {res.title}
              </h4>
              <p style={{ color: "#555", marginBottom: "10px", fontSize: "14px" }}>
                {res.abstract}
              </p>
          
              <Link href={res.link || "#"}>
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "#FFE200",
                    color: "black",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    textAlign: "center",
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                    fontSize: "10px",
                    width: "100%",
                    transition: "background-color 0.3s",
                  }}
                >
                  Abstract
                </div>
              </Link>
          
              {/* Bookmark Icon */}
              <button
  onClick={() => handleBookmark(res)}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
  }}
  title="Bookmark"
>
  <FontAwesomeIcon
    icon={bookmarkedTitles.includes(res.title) ? solidStar : regularStar}
    style={{ color: "#FFD700", fontSize: "20px" }}
  />
</button>

            </div>
          
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                padding: "30px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              <p>No results found. Please try again with different keywords or filters.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
