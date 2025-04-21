"use client";

import { useState, useEffect } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import { Dropdown, DropdownTrigger, DropdownMenu } from "@nextui-org/dropdown";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; 
import { Lock, FileText, Share2 } from "lucide-react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons"; // Filled star
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons"; // Outline star


const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedTitles, setBookmarkedTitles] = useState([]);

  // Filter states
  const [sortBy, setSortBy] = useState("date");
  const [dateRange, setDateRange] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjects = ["Accounting", "Agriculture", "Biology", "Chemistry", "Engineering", "History"];

  // Handle search input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue) {
        fetchMaterialsData(trimmedValue);
      }
    }
  };

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
          .eq("title", item.title)
          
  
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
            authors: item.authors || null,
            publicationDate: item.publicationDate || null,
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
  
  const fetchMaterialsData = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from("Materials")
        .select("*")
        .ilike("title", `${trimmedQuery}%`); // starts with "AD"
  
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
    if (inputValue.trim()) {
      fetchMaterialsData(inputValue);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [inputValue]);

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

  const handleSubjectChange = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
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
                        <p className="drop_btnTxt font-Montserrat text-black">All Fields</p>
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
                  <button className="searchBtn" onClick={() => fetchMaterialsData(inputValue)}>
                    <Image
                      src="/images/materials/SVGs/search.svg"
                      alt="searchBtn"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-row px-12 py-8 gap-10">
        {/* Left Filters Panel */}
        <div className="w-1/4 bg-white">
          <h2
            className="mb-4"
            style={{
              fontSize: "40px",
              fontFamily: "'Red Hat Display', sans-serif",
              color: "#4F0505",
              fontWeight: "bold",
            }}
          >
            {results.length} Results Found
          </h2>

          {/* Sort By */}
          <div className="mb-6" style={{ paddingLeft: "20px" }}>
            <h3
              className="mb-2"
              style={{
                fontSize: "30px",
                fontFamily: "'Red Hat Display', sans-serif",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Sort By
            </h3>
            <ul className="space-y-1 text-sm" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "20px"
            }}>
              {["date", "citation", "reference"].map((item) => (
                <li key={item}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      value={item}
                      checked={sortBy === item}
                      onChange={() => setSortBy(item)}
                      className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-[black] checked:bg-[#FFE200] focus:outline-none"
                    />
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Date Published */}
          <div className="mb-6" style={{ paddingLeft: "20px" }}>
            <h3
              className="mb-2"
              style={{
                fontSize: "30px",
                fontFamily: "'Red Hat Display', sans-serif",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Date Published
            </h3>
            <ul className="space-y-1 text-sm" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "20px"
            }}>
              {["Since 2000", "Since 2010", "Since 2020"].map((range) => (
                <li key={range}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="date"
                      value={range}
                      checked={dateRange === range}
                      onChange={() => setDateRange(range)}
                      className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-[black] checked:bg-[#FFE200] focus:outline-none"
                    />
                    {range}
                  </label>
                </li>
              ))}
              <li className="mt-2">
                <label className="block text-sm mb-2">Custom Year</label>
                <input
                  type="number"
                  className="w-full border p-1 rounded text-sm"
                  placeholder="Enter year"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div className="mb-6" style={{ paddingLeft: "20px" }}>
            <h3
              className="mb-2"
              style={{
                fontSize: "30px",
                fontFamily: "'Red Hat Display', sans-serif",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Subjects
            </h3>
            <ul className="space-y-1 text-sm" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "20px"
            }}>
              {subjects.map((subject) => (
                <li key={subject}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={subject}
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                      className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-[black] checked:bg-[#FFE200] focus:outline-none"
                    />
                    {subject}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          {loading ? (
            <p>Loading results...</p>
          ) : results.length > 0 ? (
            results.map((res, index) => (
              <div
                key={index}
                className="bg-white flex items-start gap-6 border border-black rounded-md shadow-md"
                style={{ width: "1000px", height: "200px",position: "relative" }}
              >
                {/* Maroon Icon Sidebar */}
                <div className="w-20 h-full flex flex-col items-center justify-around text-white"
                style={{ 
                  backgroundColor: "#4F0505" }}>
                  <Lock size={23} />
                  <FileText size={23} />
                  <Share2 size={23} />
                </div>

                <div className="flex-1">
                  <h4 className="pt-4 text-xl font-semibold mb-2"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: "30px",
                    paddingLeft: "10px",
                  }}>
                    {res.title}</h4>
                  
                  <h4 className="pt-2 text-l"
                    style={{
                      fontFamily: "'Red Hat Display', sans-serif",
                      color: "#000000",
                      paddingLeft: "10px",
                      fontWeight: 500,
                      fontSize: "20px", 
                    }}
                  > Author/s: </h4>

                  <h5 className="pt-1 text-l"
                    style={{
                      fontFamily: "'Red Hat Display', sans-serif",
                      color: "#000000",
                      paddingLeft: "10px",
                      fontSize: "15px",
                    }}
                  >
                    {Array.isArray(res.authors)
                      ? res.authors.map((author, i) => `${author.firstName} ${author.lastName}`).join(', ')
                      : 'Unknown Author'}
                  </h5>

                  <h5 className="pt-3 text-l"
                    style={{
                      fontFamily: "'Red Hat Display', sans-serif",
                      color: "#000000",
                      paddingLeft: "10px",
                      fontSize: "15px",
                    }}
                  >
                    Date Published:{' '}
                    {res.publicationDate
                      ? new Date(res.publicationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Unknown Date'}
                  </h5>
                </div>

                <Link href={res.link || "#"}>
                  <div
                    className="flex items-center justify-center px-4 py-2 rounded transition duration-300 transform hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: "#FFE200",
                      color: "#000000",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: "bold",
                      fontSize: "15px",
                      width: "100px",
                      height: "30px",
                      marginTop: "150px",
                      marginRight: "20px",
                    }}
                  >
                    Abstract
                  </div>
                </Link>
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
            <div className="col-span-full bg-red-100 text-red-700 p-6 rounded-lg text-center font-medium">
              No results found. Try different keywords or filters.
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
