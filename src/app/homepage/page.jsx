"use client";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";
import Footer from "../footer/page";



const Home = () => {
    
    return( 
        <div className="home_cont min-h-screen w-full bg-white ">
            <div className="home_content flex flex-col h-full">
                <Header />

                <div className="body mt-10 mb-40 flex items-center justify-between bg-background">
                    <div className="body_left">
                        <img src="./images/materials/pylon2022.png" alt="PUP Pylon Image" className="pylon_img"/>
                    </div>

                    <div className="body_right p-8 flex flex-col align-left justify-around gap-28 w-min">
                        <h1 className="right_txt font-Cinzel font-black uppercase text-med text-white opacity-80">Open Minds with Open Access</h1>

                        <div className="search_bar_cont">
                            <div className="search_bar_content flex flex-row">
                                <div className="dropdown">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <div className="drop_btn flex flex-row items-center gap-min py-med px-lg border cursor-pointer">
                                                <Image src="/images/materials/SVGs/down.svg" alt="dropdownBtn" width={30} height={30} />
                                                <p className="drop_btnTxt font-Montserrat text-black">All Fields</p>
                                            </div>
                                        </DropdownTrigger>
                                        
                                        <DropdownMenu className="drop_menu" aria-label="Filter Options">
                                            {/* <DropdownItem key="keywords">Keywords</DropdownItem>
                                            <DropdownItem key="author">Author</DropdownItem>
                                            <DropdownItem key="subject">Subject</DropdownItem>
                                            <DropdownItem key="access">Access Type</DropdownItem>
                                            <DropdownItem key="language">Language</DropdownItem> */}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="search_field">
                                    <input type="text" placeholder="What are you looking for?..." className="search_field_bar h-med p-lg"/>
                                </div>
                                <div className="search_btn">
                                    <Link href={'./searchresults/'}>
                                        <button className="searchBtn">
                                            <Image src="/images/materials/SVGs/search.svg" alt="searchBtn" width={30} height={30} />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                        
                        <div className="bottom_txt font-Red_Hat_Display text-white w-11/12 text-justify">
                            <p>The Research Institute for Science and Technology (RIST) integrates holistic programs to advance research in the life sciences, physical sciences, mathematics, engineering, computing and information sciences.</p>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default Home;