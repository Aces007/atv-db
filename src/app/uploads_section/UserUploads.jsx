import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserUploads = () => {
    const [userUploads, setUserUploads] = useState([]);
    

    useEffect(() => {
        const fetchUserUploads = async () => {
            const { data: {user}} = await supabase.auth.getUser();
            if (user) {
                const {data, error} = await supabase
                    .from("Materials")
                    .select("*")
                    .eq("user_id", user.id);
                setUserUploads(data || []);
            };
        };
        fetchUserUploads();
    }, []);


    return (
        <div className="userUploads_cont">
            <div className="userUploads content">
                <h2 className="font-Red_Hat_Display font-bold text-lg mt-8 mx-10 text-white">
                    User Uploads
                </h2>
                <ul className="space-y-4 mx-10 my-4">
                    {userUploads.length === 0 ? (
                            <li className="text-gray-400">No uploads found.</li>
                        ) : (
                        userUploads.map((upload) => (
                            <li key={upload.id} className="rounded-lg p-4 cursor-pointer bg-white hover:bg-yellow-400 transition-colors">
                                <div className="flex flex-row items-center gap-8 px-4">
                                    <FontAwesomeIcon icon={faBook} size={"2x"} className="text-gray-800" />
                                    <div className="flex flex-col items-start gap-4">
                                        <h3 className="font-Red_Hat_Display text-gray-800 text-sm font-bold hover:text-black transition-colors">{upload.title}</h3>
                                        <div className="flex flex-row items-center gap-8">
                                            <p className="font-Red_Hat_Display text-min text-gray-600 font-semibold mt-1 hover:text-gray-800 transition-colors">{upload.materialType}</p>
                                            <p className="font-Red_Hat_Display text-min text-gray-600 font-semibold mt-1 hover:text-gray-800 transition-colors">Accessed: {upload.accessCount} times</p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}

export default UserUploads;