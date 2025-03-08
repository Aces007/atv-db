"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
import Image from "next/image";
import Link from "next/link";
import Header from "../header/page";

const About = () => {
    return (
        <div className="about_cont">
            <div className="about_content">
                <Header />

                <div className="banner_cont">
                    <img src="./images/materials/mainCampus.jpg" alt="PUP Mural" className="pupMain_img" />

                    <div className="banner_content p-16 flex flex-col items-left justify-around gap-28 w-screen">
                        <h1 className="right_txt font-Cinzel font-black uppercase text-lg text-white opacity-80">About</h1>
                    </div>
                </div>

                <div className="about_pup">
                    <div className="about_pupTxt">
                        <p className="font-Red_Hat_Display text-sm text-black">
                            The Polytechnic University of the Philippines (PUP) is a premier state university committed to providing quality, responsive, and accessible education to the Filipino youth. With a rich history spanning over a century, PUP is a leading institution in delivering higher education programs in the fields of commerce, business administration, technology, social sciences, and applied arts.
                            <br /> <br />
                            Governed by the Board of Regents and guided by its vision of fostering innovation and academic excellence, PUP nurtures students to become creative, self-reliant, and socially responsible individuals. The University stands as a beacon for economically challenged students, offering them opportunities to pursue their dreams and contribute meaningfully to nation-building.
                            <br /> <br />
                            With over 20 campuses, cutting-edge research programs, and a diverse student population that includes international scholars, PUP continues to uphold its mission of harnessing the nation’s human resource potential through world-class instruction, advanced studies, and progressive leadership.
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default About;