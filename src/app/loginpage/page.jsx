import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMobileScreen, faWifi, faCheck } from "@fortawesome/free-solid-svg-icons";


const Login = () => {
    return (
        <div className="login_cont">
            <div className="login_columns flex flex-row items-center justify-between">
                <div className="flex flex-col items-center w-full h-screen py-6">
                    <div className="flex flex-col items-center gap-2">
                        <Image src="/images/materials/openU.png" alt="openULogo" width={140} height={140} />
                        <h1 className="font-Cinzel font-bold text-3xl tracking-widest">“Mula Sa ‘yo, Para sa Bayan”</h1>
                    </div>

                    <div className="flex flex-col mt-6 gap-6">
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faGlobe} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Global</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faMobileScreen} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Mobile Friendly</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faWifi} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Virtual Learning</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faCheck} size="2x" color="white" className="svgConfOpenU" />
                            <p className="font-Red_Hat_Display uppercase font-bold text-base">Learn and Work</p>
                        </div>
                    </div>
                </div>

                <div className="login_panel flex flex-col items-center w-full h-screen py-6">
                    <div className="flex flex-col items-center gap-2">
                        <Image src="/images/logo.png" alt="openULogo" width={140} height={140} />
                        <h1 className="font-Cinzel font-bold text-3xl text-white tracking-widest">Architech Vault</h1>
                    </div>

                    <div >
                        <div className="username_input">
                            
                        </div>

                        <div className="password_input">

                        </div>
                    </div>
                    <img src="./images/materials/obelisk.jpg" alt="PUP Pylon Image" className="obelisk_img"/>
                </div>
            </div>
        </div>        
    )
}


export default Login;