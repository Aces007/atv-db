"use client";

import { useEffect, useState } from "react";
import { useWebsiteContext } from "../WebsiteContext";
import Image from "next/image";

const Bookmarks = () => {
    const { fetchUserBookmarks, user } = useWebsiteContext();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.id) {
            console.warn("User not available yet.");
            return;
        }

        const getBookmarks = async () => {
            try {
                const userBookmarks = await fetchUserBookmarks(user.id);
                if (!userBookmarks || userBookmarks.length === 0) {
                    setBookmarks([]);
                } else {
                    setBookmarks(userBookmarks);
                }
            } catch (error) {
                console.error("Failed to fetch bookmarks:", error);
            } finally {
                setLoading(false);
            }
        };

        getBookmarks();
    }, [user]);

    return (
        <div className="bookmarks_panel px-10 py-6">
            <h2 className="font-Red_Hat_Display font-bold text-lg mb-4 text-white">Your Bookmarked Items</h2>

            {loading ? (
                <p className="text-gray-400">Loading bookmarks...</p>
            ) : bookmarks.length === 0 ? (
                <p className="text-gray-400">You have no bookmarks yet.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark, index) => (
                        <li key={index} className="bookmark_card p-4 rounded-xl bg-white bg-opacity-90 shadow-md">
                            <div className="bookmark_img mb-2">
                                <Image
                                    src={bookmark.image || "/images/materials/bookmark_placeholder.png"}
                                    alt="Bookmark Thumbnail"
                                    width={200}
                                    height={120}
                                    className="rounded-md"
                                />
                            </div>
                            <h3 className="font-bold text-md mb-1">{bookmark.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{bookmark.description}</p>
                            <a
                                href={bookmark.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                            >
                                Visit Link
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Bookmarks;
