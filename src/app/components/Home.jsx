const Home = () => {
    return( 
        <div className="home_cont min-h-screen w-full bg-white ">
            <div className="home_content flex flex-col h-full">
                <div className="header pl-12 pt-6 ">
                    <div className="header_left flex flex-row items-center gap-5">
                        <img src="./images/logo.png" alt="ATV Logo" className="w-20 h-20"/>
                        <div className="logo_txt flex flex-col">
                            <h1 className="uppercase text-3xl text-black">Architech Vault</h1>
                            <h2 className="uppercase text-xl text-black">Pup Open University</h2>
                        </div>
                    </div>

                    <div className="header_right">

                    </div>
                </div>

                <div className="body mt-10 mb-40 flex items-center justify-between bg-background p-10">
                    <div className="body_left">
                        <img src="./images/materials/pylon2022.png" alt="PUP Pylon Image" className="pylon_img"/>
                    </div>

                    <div className="body_right">
                        <h1 className="uppercase text-4xl text-white opacity-80">Open Minds with Open Access</h1>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;