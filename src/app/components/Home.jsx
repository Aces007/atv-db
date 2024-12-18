import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import Image from "next/image";



const Home = () => {
    return( 
        <div className="home_cont min-h-screen w-full bg-white ">
            <div className="home_content flex flex-col h-full">
                <div className="header px-12 py-6 flex flex-row items-center justify-between">
                    <div className="header_left">
                        <img src="./images/logo.png" alt="ATV Logo" className="logo_img"/>
                        <div className="logo_txt flex flex-col relative top-2">
                            <h1 className="logo_h1 uppercase text-black">Architech Vault</h1>
                            <h2 className="logo_h2 uppercase text-black">Pup Open University</h2>
                        </div>
                    </div>

                    <div className="header_right flex flex-row items-center gap-10">
                        <a href="#about" className="font-Montserrat font-bold uppercase">About</a>
                        <a href="#ous" className="font-Montserrat font-bold uppercase">PUP OUS</a>
                        <button href="#login" className="login_btn px-5 py-2 font-Montserrat font-bold">LOGIN</button>
                    </div>
                </div>

                <div className="body mt-10 mb-40 flex items-center justify-between bg-background">
                    <div className="body_left">
                        <img src="./images/materials/pylon2022.png" alt="PUP Pylon Image" className="pylon_img"/>
                    </div>

                    <div className="body_right p-8 flex flex-col align-left justify-around gap-28 w-min">
                        <h1 className="right_txt font-Cinzel font-black uppercase text-4xl text-white opacity-80">Open Minds with Open Access</h1>

                        <div className="search_bar_cont">
                            <div className="search_bar_content">
                                <div className="dropdown">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <div className="drop_btn flex flex-row items-center gap-5 py-3 px-5 border cursor-pointer">
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

                                </div>
                                <div className="search_btn">
                                
                                </div>
                            </div>

                        </div>
                        
                        <div className="bottom_txt font-Red_Hat_Display text-white w-11/12 text-justify">
                            <p>The Research Institute for Science and Technology (RIST) integrates holistic programs to advance research in the life sciences, physical sciences, mathematics, engineering, computing and information sciences.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;