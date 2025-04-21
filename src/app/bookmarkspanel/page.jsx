"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserAndBookmarks = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          console.warn("User not authenticated");
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const { data: bookmarkData, error: bookmarkError } = await supabase
          .from("Bookmarks")
          .select("*")
          .eq("user_id", user.id);

        if (bookmarkError) throw bookmarkError;

        setBookmarks(bookmarkData || []);
      } catch (error) {
        console.error("Error fetching bookmarks:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookmarks();
  }, []);

  const formatAuthors = (authorsText) => {
    try {
      const authorsArray = JSON.parse(authorsText);
      if (!Array.isArray(authorsArray)) return "Unknown Author";

      return authorsArray
        .map(
          (author) =>
            `${author.firstName?.trim() || ""} ${author.lastName?.trim() || ""}`
        )
        .join(", ");
    } catch {
      return "Unknown Author";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Unknown Date" : date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bookmarks_panel px-10 py-6">
      <h2 className="font-Red_Hat_Display font-bold text-lg mb-4 text-white">
        Your Bookmarked Items
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading bookmarks...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-gray-400">You have no bookmarks yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark, index) => (
            <li
              key={index}
              className="bookmark_card p-4 rounded-xl bg-white bg-opacity-90 shadow-md"
            >
              <h3 className="font-bold text-md mb-1 text-black">
                {bookmark.title}
              </h3>
              <p className="text-xs text-gray-500">
              Author/s: {formatAuthors(bookmark.authors)}
              </p>
              <p className="text-xs text-gray-500">
                Published: {formatDate(bookmark.publicationDate)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;
