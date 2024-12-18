// import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";

const Home = () => {
    return( 
        <div className="home_cont min-h-screen w-full bg-white ">
            <div className="home_content flex flex-col h-full">
                <div className="header pl-12 pt-6 flex flex-row items-center justify-between">
                    <div className="header_left">
                        <img src="./images/logo.png" alt="ATV Logo" className="logo_img"/>
                        <div className="logo_txt flex flex-col relative top-2">
                            <h1 className="logo_h1 uppercase text-black">Architech Vault</h1>
                            <h2 className="logo_h2 uppercase text-black">Pup Open University</h2>
                        </div>
                    </div>

                    <div className="header_right">
                        <a href="#about">About</a>
                        <a href="#ous">PUP OUS</a>
                        <button href="#login">LOGIN</button>
                    </div>
                </div>

                <div className="body mt-10 mb-40 flex items-center justify-between bg-background">
                    <div className="body_left">
                        <img src="./images/materials/pylon2022.png" alt="PUP Pylon Image" className="pylon_img"/>
                    </div>

                    <div className="body_right p-8 border-4 border-white">
                        <h1 className="right_txt uppercase text-4xl text-white opacity-80">Open Minds with Open Access</h1>

                        <div className="search_bar_cont">
                            <div className="search_bar_content">
                                <div className="dropdown">
                                    {/* <Dropdown>
                                        <DropdownTrigger>

                                            <p>All Fields</p>
                                        </DropdownTrigger>
                                        
                                        <DropdownMenu>

                                        </DropdownMenu>
                                    </Dropdown> */}
                                </div>
                                <div className="search_field">

                                </div>
                                <div className="search_btn">
                                
                                </div>
                            </div>

                            <div className="radio_btns">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;