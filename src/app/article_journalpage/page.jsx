"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../header/page";
import Footer from "../footer/page";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";

export default function ArticleJournalPage() {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [article, setArticle] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false); // Bookmark state

  useEffect(() => {
    if (title) {
      fetchArticle(title);
      fetchSimilarArticles();
    }
  }, [title]);

  async function fetchArticle(articleTitle) {
    const { data, error } = await supabase
      .from("Materials")
      .select("*")
      .ilike("title", `%${articleTitle}%`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching article:", error);
      setLoading(false);
      return;
    }

    setArticle(data);
    setLoading(false);
  }

  async function fetchSimilarArticles() {
    const { data, error } = await supabase
      .from("Materials")
      .select("id, title, authors, publicationDate")
      .limit(5);

    if (data) setSimilarArticles(data);
  }

  // Handle bookmark toggle
  const toggleBookmark = async () => {
    setIsBookmarked((prev) => !prev);
    // Optionally, save the bookmark status to the database or local storage
    // For example, using supabase:
    if (!isBookmarked) {
      // Save to bookmarks table or local storage (if needed)
      // await supabase.from("Bookmarks").insert([{ articleId: article.id }]);
    } else {
      // Remove from bookmarks table or local storage (if needed)
      // await supabase.from("Bookmarks").delete().match({ articleId: article.id });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-redhat">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen font-redhat">
        <Header />
        <main className="flex-1 flex justify-center items-center p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No article found</h1>
            <p className="text-gray-600">We couldn't find an article matching that title.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-redhat bg-gray-50">
      <Header />

      <main className="flex-1 p-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-[#5c0a0a] p-6 rounded-2xl text-white">
              <h2 className="text-2xl font-bold mb-6 tracking-widest whitespace-nowrap">
                Similar Articles
              </h2>
              <div className="space-y-6 text-sm">
                {similarArticles.map((item) => (
                  <div key={item.id} className="pb-4 border-b border-white/30 last:border-0">
                    <Link 
                      href={`/article_journalpage?title=${encodeURIComponent(item.title)}`} 
                      className="text-white underline text-xl font-bold block mb-2">
                      {item.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 text-xs text-white">
                      <span>
                        <strong>Author:</strong> {Array.isArray(item.authors) ? item.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ") : "Unknown"}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Published:</strong> {item.publicationDate ? new Date(item.publicationDate).getFullYear() : "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Poster below the red box */}
            <div className="mt-8 flex justify-center">
              <Image src="/images/poster.jpg" alt="Material Poster" width={400} height={500} className="rounded-xl shadow-lg" />
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            <div className="text-sm text-gray-500 mb-6">
              Accessed {Math.floor(Math.random() * 10000) + 1} times
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold text-gray-800">
                {Array.isArray(article.authors)
                  ? article.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
                  : "Unknown Author"}
              </span>
              <button className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2">
                <Link href={article.contactLink || "#"} 
                  className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  Contact Author
                </Link>
              </button>
            </div>

            <div className="flex items-center gap-8 mb-10 text-gray-600 text-sm font-medium">
              <Link href={article.citationsLink || "#"} 
                className="hover:underline flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} /> Citations
              </Link>
              <Link href={article.pdfLink || "#"} 
                className="hover:underline flex items-center gap-2">
                <FontAwesomeIcon icon={faDownload} /> PDF
              </Link>
              <button 
                onClick={toggleBookmark} 
                className="hover:underline flex items-center gap-2">
                <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Abstract</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap text-justify">
                {article.abstract || "No abstract available."}
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
