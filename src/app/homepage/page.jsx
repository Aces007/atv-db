"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import Footer from "../footer/page";

const Home = () => {
  const router = useRouter();

  // mirror exactly what SearchResults expects:
  const [inputValue, setInputValue] = useState("");
  const [searchField, setSearchField] = useState("all");

  const subjects = [
    "all",
    "keywords",
    "author",
    "material",
  ];

  // on Enter press in the input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // when user clicks the button (or on Enter) we redirect
  const handleSearch = () => {
    const q = inputValue.trim();
    if (!q) {
      alert("Please input a search term.");
      return;
    }
    // pass both query and field so SearchResults can pick them up
    router.push(
      `/searchresults?query=${encodeURIComponent(q)}&field=${encodeURIComponent(
        searchField
      )}`
    );
  };

  return (
    <div className="home_cont min-h-screen w-full bg-white">
      <div className="home_content flex flex-col h-full">
        <Header />

        <div className="body mt-10 mb-40 flex items-center justify-between bg-background">
          <div className="body_left">
            <img
              src="./images/materials/pylon2022.png"
              alt="PUP Pylon Image"
              className="pylon_img"
            />
          </div>

          <div className="body_right p-8 flex flex-col align-left justify-around gap-28 w-min">
            <h1 className="right_txt font-Cinzel font-black uppercase text-med text-white opacity-80">
              Open Minds with Open Access
            </h1>

            {/* wrap in a form so Enter works everywhere */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="search_bar_cont"
            >
              <div className="search_bar_content flex flex-row">
                {/* dropdown for field */}
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

                {/* text input */}
                <div className="search_field">
                  <input
                    type="text"
                    placeholder="What are you looking for?..."
                    className="search_field_bar h-med p-lg"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* search button */}
                <div className="search_btn">
                  <button
                    type="button"
                    className="searchBtn"
                    onClick={handleSearch}
                  >
                    <Image
                      src="/images/materials/SVGs/search.svg"
                      alt="searchBtn"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </form>

            <div className="bottom_txt font-Red_Hat_Display text-white w-11/12 text-justify">
              <p>
                The Research Institute for Science and Technology (RIST)
                integrates holistic programs to advance research in the life
                sciences, physical sciences, mathematics, engineering, computing
                and information sciences.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
