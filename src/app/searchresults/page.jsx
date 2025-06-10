"use client";

import { useState, useEffect } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; 
import { Lock, FileText, Share2 } from "lucide-react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-regular-svg-icons"; 
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";


const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedTitles, setBookmarkedTitles] = useState([]);
  const [searchField, setSearchField] = useState("all"); // Default search field

  // Filter states
  const [sortBy, setSortBy] = useState("date");
  const [dateRanges, setDateRanges] = useState([]);
  const [customDate, setCustomDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const subjects = ["Accounting", "Agriculture", "Biology", "Chemistry", "Engineering", "Esports", "Health Science", "History", "Literature", "Social Science", "Sports", "Technology", "Wellness and Lifestyle"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      alert("Please input a search term.");
      fetchMaterialsData(""); 
    } else {
      fetchMaterialsData(inputValue);
    }
  };
  
  const fetchMaterialsData = async (query) => {
    const trimmedQuery = query.trim();
    setLoading(true);
    try {
      let supaQuery = supabase.from("Materials").select("*").eq("is_approved", true);

      if (selectedSubjects.length > 0) {
        const subjectFilters = selectedSubjects.map(
          (subject) => `subject.ilike.%${subject}%`
        );
        supaQuery = supaQuery.or(subjectFilters.join(","));
      }
      
  

      if (searchField === "all" || searchField === "author") {
        if (trimmedQuery.includes(" ")) {
          const [firstName, lastName] = trimmedQuery.split(" ");
          const lowerFirst = firstName.toLowerCase();
          const lowerLast = lastName.toLowerCase();
  
          if (searchField === "all") {
            supaQuery = supaQuery.or([
              `title.ilike.%${trimmedQuery}%`,
              `abstract.ilike.%${trimmedQuery}%`,
              `tags.ilike.%${trimmedQuery}%`,
              `materialType.ilike.%${trimmedQuery}%`,
              `authors->>0.ilike.%${lowerFirst}%`, 
              `authors->>1.ilike.%${lowerLast}%`
            ].join(","));
          }
  
          if (searchField === "author") {
            supaQuery = supaQuery.or([
              `authors->>0.ilike.%${lowerFirst}%`, 
              `authors->>1.ilike.%${lowerLast}%`
            ].join(","));
          }
        } else {
          if (searchField === "all") {
            supaQuery = supaQuery.or([
              `title.ilike.%${trimmedQuery}%`,
              `abstract.ilike.%${trimmedQuery}%`,
              `tags.ilike.%${trimmedQuery}%`,
              `materialType.ilike.%${trimmedQuery}%`,
              `authors->>0.ilike.%${trimmedQuery}%`, 
              `authors->>1.ilike.%${trimmedQuery}%` 
            ].join(","));
          } else if (searchField === "author") {
            supaQuery = supaQuery.or([
              `authors->>0.ilike.%${trimmedQuery}%`, 
              `authors->>1.ilike.%${trimmedQuery}%` 
            ].join(","));
          }
        }
      } else if (searchField === "keywords") {
        supaQuery = supaQuery.or([
          `title.ilike.%${trimmedQuery}%`,
          `abstract.ilike.%${trimmedQuery}%`,
          `tags.ilike.%${trimmedQuery}%`
        ].join(","));
      } else if (searchField === "material") {
        supaQuery = supaQuery.ilike("materialType", `%${trimmedQuery}%`);
      }

      const { data, error } = await supaQuery;
      if (error) throw error;

      // Apply date filtering
      let filteredResults = filterByDate(data);

      // Apply sorting
      filteredResults = sortResults(filteredResults);

      setResults(filteredResults);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialsData("");  // Fetch all on load
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue.trim()) {
        await fetchMaterialsData(inputValue);
      } else {
        setResults([]);
        setLoading(false);
      }
  
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
  
    fetchData();
  }, [inputValue]);

  useEffect(() => {
    const sorted = sortResults([...results]); 
    setResults(sorted);
  }, [sortBy]);


  useEffect(() => {
    fetchMaterialsData(inputValue); 
  }, [inputValue, selectedSubjects]);

  
  const handleDateRangeChange = (range) => {
    if (dateRanges.includes(range)) {
      setDateRanges(dateRanges.filter((r) => r !== range));
    } else {
      setDateRanges([...dateRanges, range]);
    }
  };  

  function handleSubjectChange(subject) {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  } 

  const sortResults = (results) => {
    switch (sortBy) {
      case "date":
        return results.sort((a, b) => new Date(a.publicationDate) - new Date(b.publicationDate));
      case "citation":
        return results.sort((a, b) => (a.citationCount ?? 0) - (b.citationCount ?? 0));
      case "reference":
        return results.sort((a, b) => (a.referenceCount ?? 0) - (b.referenceCount ?? 0));
      default:
        return results;
    }
  };
  
  const handleSortChange = (item) => {
    setSortBy(item);
  };
  

  const filterByDate = (results) => {
    if (dateRanges.length === 0 && !customDate) {
      return results;
    }

    let cutoffYears = dateRanges.map((range) => ({
      "Since 2000": 2000,
      "Since 2010": 2010,
      "Since 2020": 2020,
    }[range]));

    if (customDate) {
      cutoffYears.push(parseInt(customDate));
    }

    return results.filter((res) => {
      if (!res.publicationDate) return false;
      const pubYear = new Date(res.publicationDate).getFullYear();
      return cutoffYears.some((year) => pubYear >= year);
    });
  };
  
  const filteredResults = filterByDate(results);
  const sortedResults = sortResults(filteredResults);

  
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
              Open Minds with Open Acess
            </h1>

            <div className="search_bar_cont relative">
              <div className="search_bar_content flex flex-row">
                <div className="dropdown">
                  <Dropdown>
                    <DropdownTrigger>
                      <div
                        className="drop_btn flex flex-row items-center gap-min py-med px-lg border cursor-pointer"
                      >
                        <Image
                          src="/images/materials/SVGs/down.svg"
                          alt="dropdownBtn"
                          width={30}
                          height={30}
                        />
                        <p className="drop_btnTxt font-Montserrat text-[16px] font-medium text-black w-[110px]">
                          {{
                            all: "All Fields",
                            keywords: "Keywords",
                            author:   "Author",
                            material: "Material Type",
                          }[searchField]}
                        </p>
                      </div>
                    </DropdownTrigger>

                    <DropdownMenu
                      className="drop_menu bg-[#E5E5E5] rounded-[5px] w-[200px]"
                      aria-label="Filter Options"
                      onAction={(key) => setSearchField(key)}
                    >
                      <DropdownItem
                        key="all"
                        className="font-Montserrat text-black text-[16px] hover:bg-[#B6B4B4] w-full"
                      >
                        <span className="font-medium">All Fields</span> <span className="font-normal">(Default)</span>              
                      </DropdownItem>
                      <DropdownItem
                        key="keywords"
                        className="font-Montserrat text-black text-[16px] hover:bg-[#B6B4B4] w-full"
                      >
                        <span className="font-medium">Keywords</span>           
                      </DropdownItem>
                      <DropdownItem
                        key="author"
                        className="font-Montserrat text-black text-[16px] hover:bg-[#B6B4B4] w-full"
                      >
                        <span className="font-medium">Author</span>
                      </DropdownItem>
                      <DropdownItem
                        key="material"
                        className="font-Montserrat text-black text-[16px] hover:bg-[#B6B4B4] w-full"
                      >
                        <span className="font-medium">Material Type</span>
                      </DropdownItem>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch(e);
                    }}
                  />
                </div>

                <div className="search_btn">
                  <button className="searchBtn" onClick={handleSearch}>
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
              <span
                className="sort-order-label"
                style={{
                  display: "inline-block",        
                  verticalAlign: "middle",       
                  backgroundColor: "#4F0505",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  fontFamily: "'Red Hat Display', sans-serif",
                  fontWeight: 800,
                  padding: "2px 5px",
                  borderRadius: "5px",
                  marginLeft: "10px",
                  marginTop: "1px",
                  marginBottom: "8px",      
                }}
              >
                Ascending
              </span>
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
                      onChange={() => handleSortChange(item)}
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
                      type="checkbox"
                      value={range}
                      checked={dateRanges.includes(range)}
                      onChange={() => handleDateRangeChange(range)}
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
        ) : sortedResults.length > 0 ? (
          sortedResults.map((res, index) => (
            <div
              key={index}
              className="bg-white flex items-start gap-6 border border-black rounded-md shadow-md"
              style={{ width: "1000px", height: "240px", position: "relative" }}
            >
              {/* Maroon Icon Sidebar */}
              <div
                className="w-20 h-full flex flex-col items-center justify-around text-white"
                style={{ backgroundColor: "#4F0505" }}
              >
                <Lock size={23} />
                <FileText size={23} />
                <Share2 size={23} />
              </div>

              <div className="flex-1 min-w-0">
                {/* Title */}
                <h4
                  className="pt-5 text-xl font-semibold mb-2"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: "30px",
                    height: "52px",
                    paddingLeft: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {res.title}
                </h4>

                {/* Citation Count */}
                <h5
                  className="pt-1 text-l mb-1"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    paddingLeft: "10px",
                    fontWeight: 400,
                    fontSize: "20px",
                    color: "#4F0505",
                  }}
                >
                  Citations: {res.citationCount ?? 0}
                </h5>

                {/* Authors */}
                <h4
                  className="pt-2 text-l"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    color: "#000000",
                    paddingLeft: "10px",
                    fontWeight: 600,
                    fontSize: "20px",
                  }}
                >
                  Author/s:
                </h4>

                <h5
                  className="pt-1 text-l"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    paddingLeft: "10px",
                    fontSize: "15px",
                  }}
                >
                  {Array.isArray(res.authors)
                    ? res.authors.map((author) => `${author.firstName} ${author.lastName}`).join(", ")
                    : "Unknown Author"}
                </h5>

                {/* Date Published */}
                <h5
                  className="pt-3 text-l"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    paddingLeft: "10px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Date Published:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {res.publicationDate
                      ? new Date(res.publicationDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown Date"}
                  </span>
                </h5>

                {/* Material Type */}
                <h5
                  className="pt-1 text-l"
                  style={{
                    fontFamily: "'Red Hat Display', sans-serif",
                    paddingLeft: "10px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Material Type:{" "}
                  <span style={{ fontWeight: 400 }}>
                    {res.materialType || "Unknown"}
                  </span>
                </h5>
              </div>

              {/* Abstract Link */}
              <Link href={`/article_journalpage?title=${encodeURIComponent(res.title)}`}>
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

              {/* Bookmark Button */}
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
