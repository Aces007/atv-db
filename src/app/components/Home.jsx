const Home = () => {
    return( 
        <div className="home_cont pl-10 pt-5 min-h-screen w-full bg-white ">
            <div className="home_content flex flex-col h-full">
                <div className="header">
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

                <div className="body self-center flex flex-row bg-background m-20 p-10 w-full">
                    <div className="body_left">
                        <img src="./images/materials/pylon2022.png" alt="PUP Pylon Image" className="pylon_img"/>
                    </div>

                    <div className="body_right">
                        <h1>Open Minds with Open Access</h1>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;