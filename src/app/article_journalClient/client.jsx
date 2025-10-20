"use client";

import { useEffect, useState } from "react";
import Header from "../header/page";
import Footer from "../footer/page";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFileLines as faFileLinesRegular, faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import CitationModal from "../components/CitationModal"; //Citation

const ArticleJournalPageClient = () => {
  const [materialData, setMaterialData] = useState(null); // Citation
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false); // Citation
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  
  const [article, setArticle] = useState(null);
  const [similarArticles, setSimilarArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showContributorProfile, setShowContributorProfile] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [authorDetails, setAuthorDetails] = useState({
    fullname: "",
    course: "",
    email: "",
    mobile: "",
    avatar: "/avatar.png",
  });
  const [contributor, setContributor] = useState({
    fullname: "",
    course: "",
    email: "",
    mobile: "",
    avatar: "/avatar.png",
  });

  useEffect(() => {
    if (title) {
      fetchArticle(title);
      fetchSimilarArticles();
      checkIfBookmarked(title);
      setShowContributorProfile(false);
    }
  }, [title]);

  useEffect(() => {
    if (!article?.id) return;

    const channel = supabase
      .channel("access-count")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Materials",
          filter: `id=eq.${article.id}`,
        },
        (payload) => {
          setArticle((prev) => ({
            ...prev,
            accessCount: payload.new.accessCount,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [article?.id]);

  // Function to fetch contributor user from Users table by user_id UUID
  async function fetchContributorById(userId) {
    if (!userId) return;

    const { data, error } = await supabase
      .from("Users")
      .select("name, course, email, mobile_number")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching contributor:", error);
      return;
    }
    if (data) {
      setContributor({
        fullname: data.name || "",
        course: data.course || "",
        email: data.email || "",
        mobile: data.mobile_number || "",
        avatar: "/avatar.png",
      });
    }
  }

  async function fetchArticle(articleTitle) {
    const { data: article, error } = await supabase
      .from("Materials")
      .select("*")
      .eq("title", articleTitle)
      .single();

    if (error || !article) {
      console.error("Error fetching article:", error);
      setLoading(false);
      return;
    }

    // Increment access count
    const updatedCount = (article.accessCount || 0) + 1;

    await supabase
      .from("Materials")
      .update({ accessCount: updatedCount })
      .eq("id", article.id);

    const { data: updatedArticle } = await supabase
      .from("Materials")
      .select("*")
      .eq("id", article.id)
      .single();

    setArticle(updatedArticle);

    // Fetch author details from "Users" table if user_id exists
    if (updatedArticle.user_id) {
      const { data: user, error: userError } = await supabase
        .from("Users")
        .select("name, course, email, mobile_number")
        .eq("id", updatedArticle.user_id)
        .single();

      if (userError) {
        console.error("Error fetching author details:", userError);
      } else if (user) {
        setAuthorDetails({
          fullname: user.name || "",
          course: user.course || "",
          email: user.email || "",
          mobile: user.mobile_number || "",
          avatar: "/avatar.png",
        });
      } else {
        setAuthorDetails({
          fullname: "",
          course: "",
          email: "",
          mobile: "",
          avatar: "/avatar.png",
        });
      }
    } else {
      setAuthorDetails({
        fullname: "",
        course: "",
        email: "",
        mobile: "",
        avatar: "/avatar.png",
      });
    }

    setLoading(false);

    // Fetch contributor profile by user_id UUID from article record
    if (updatedArticle.user_id) {
      fetchContributorById(updatedArticle.user_id);
    } else {
      // fallback reset contributor to empty if no user_id
      setContributor({
        fullname: "",
        course: "",
        email: "",
        mobile: "",
        avatar: "/avatar.png",
      });
    }
  }

  async function fetchSimilarArticles() {
    const { data } = await supabase
      .from("Materials")
      .select("id, title, authors, publicationDate")
      .limit(5);

    if (data) setSimilarArticles(data);
  }

  async function checkIfBookmarked(articleTitle) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsBookmarked(false);
      return;
    }

    const { data, error } = await supabase
      .from("Bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("title", articleTitle)
      .single();

    setIsBookmarked(!error && !!data);
  }

  const handleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to save bookmarks.");
      return;
    }

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("Bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("title", article.title);

        if (error) throw error;
        setIsBookmarked(false);
        toast.success("Removed bookmark.");
      } else {
        const { error } = await supabase.from("Bookmarks").insert([
          {
            user_id: user.id,
            title: article.title,
            abstract: article.abstract || null,
            authors: article.authors || null,
            publicationDate: article.publicationDate || null,
          },
        ]);

        if (error) throw error;
        setIsBookmarked(true);
        toast.success("Bookmarked successfully.");
      }
    } catch (err) {
      console.error("Bookmarking error:", err.message);
      toast.error("Failed to update bookmark.");
    }
  };

  const handleContactAuthor = () => setShowContactDetails(true);

  const handleAuthorClick = () => setShowContactDetails(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-Red_Hat_Display">
        Loading...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen font-Red_Hat_Display">
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
    <div className="flex flex-col min-h-screen font-Red_Hat_Display bg-gray-50">
      <Header />
      <main className="flex-1 p-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            {showContributorProfile ? (
              <div className="bg-[#5c0a0a] p-6 rounded-2xl text-white shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Image src={contributor.avatar} alt={contributor.fullname || "Contributor"} width={150} height={150} className="rounded-full shadow-md" />
                  <h2 className="text-2xl font-bold">{contributor.fullname || "Unknown"}</h2>
                  <p className="text-sm font-semibold">{contributor.course || ""}</p>
                  <div className="flex flex-col gap-2 mt-4 w-full text-center text-white text-sm">
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{contributor.email || ""}</div>
                    <div>{contributor.mobile || ""}</div>
                  </div>
                  <button
                    className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-400"
                    onClick={() => setShowContributorProfile(false)}
                  >
                    Close Contributor Profile
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#5c0a0a] p-6 rounded-2xl text-white">
                  <h2 className="text-2xl font-bold mb-6 tracking-widest whitespace-nowrap">
                    Similar Articles
                  </h2>
                  <div className="space-y-6 text-sm">
                    {similarArticles.map((item) => (
                      <div key={item.id} className="pb-4 border-b border-white/30 last:border-0">
                        <Link
                          href={`/article_journalpage?title=${encodeURIComponent(item.title)}`}
                          className="text-white underline text-xl font-bold block mb-2"
                        >
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap gap-2 text-xs text-white">
                          <span>
                            <strong>Author:</strong>{" "}
                            {Array.isArray(item.authors)
                              ? item.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
                              : "Unknown"}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Published:</strong>{" "}
                            {item.publicationDate ? new Date(item.publicationDate).getFullYear() : "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Image
                    src="/images/poster.jpg"
                    alt="Material Poster"
                    width={400}
                    height={500}
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </>
            )}
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>
            
            <div className="text-sm text-gray-500 mb-6">Accessed {article.accessCount ?? 0} times</div>
            <div className="flex items-center gap-4 mb-8">
              <span
                className="text-sm font-bold text-gray-800 cursor-pointer hover:underline"
                onClick={handleAuthorClick}
                title="Click to view author contact details"
              >
                {Array.isArray(article.authors)
                  ? article.authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ")
                  : "Unknown Author"}
              </span>

              <button className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2">
                <Link
                  href={`/authorcontact?author=${encodeURIComponent(
                    Array.isArray(article.authors) && article.authors[0]?.email
                      ? article.authors[0].email
                      : "unknown@example.com"
                  )}&title=${encodeURIComponent(article.title)}`}
                  className="flex items-center gap-2"
                  onClick={() => setShowContributorProfile(false)}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  Contact Author
                </Link>
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2"
                onClick={() => setShowContributorProfile(true)}
              >
                Contributor Profile
              </button>
            </div>

            <div className="flex items-center gap-8 mb-10 text-gray-600 text-sm font-medium">
            <button // Citation
              type="button"
              onClick={() => {
                setMaterialData(article); 
                setIsCitationModalOpen(true);
              }}
              className="hover:underline flex items-center gap-2 text-blue-600">
              <FontAwesomeIcon icon={faFileLinesRegular} /> Citation
            </button>

            <CitationModal // Citation
              isOpen={isCitationModalOpen}
              onClose={() => setIsCitationModalOpen(false)}
              materialData={materialData}
            /> 

              <button
                onClick={async () => {
                  if (!article.pdf_path) {
                    alert("No PDF available for this article.");
                    return;
                  }

                  const { data, error } = await supabase
                    .storage
                    .from("pdfs") 
                    .createSignedUrl(article.pdf_path, 60); 

                  if (error) {
                    console.error("Error generating download link:", error);
                    alert("Failed to download file.");
                    return;
                  }

                  // Trigger download
                  const link = document.createElement("a");
                  link.href = data.signedUrl;
                  link.download = article.title + ".pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="hover:underline flex items-center gap-2 text-blue-600"
              >
                <FontAwesomeIcon icon={faDownload} /> Download PDF
              </button>

              <button onClick={handleBookmark} className="hover:underline flex items-center gap-2">
                <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-2">Abstract</h2>
              <div className="h-1 w-600 bg-gray-300 mb-4"></div>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap text-justify">
                {article.abstract || "No abstract available."}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-2">Introduction</h2>
              <div className="h-1 w-600 bg-gray-300 mb-4"></div>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap text-justify">
                {article.introduction || "No introduction available."}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-2">References</h2>
              <div className="h-1 w-600 bg-gray-300 mb-4"></div>
              {article.references && article.url ? (() => {
                let references = [];
                let urls = [];

                try {
                  references = JSON.parse(article.references || "[]");
                  urls = JSON.parse(article.url || "[]");
                } catch (e) {
                  console.error("Failed to parse references or URLs:", e.message);
                }


                return Array.isArray(references) && references.length > 0 ? (
                  <ul className="space-y-6">
                    {references.map((ref, index) => (
                      <li key={index} className="text-base text-gray-700 text-justify leading-relaxed">
                        <div className="pl-6" style={{ textIndent: "-1.5rem" }}>
                          <span className="font-bold mr-2">{index + 1}.</span>
                          {ref}
                        </div>

                        {urls[index] ? (
                          <div className="pl-6 mt-1">
                            <a
                              href={urls[index]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#025E8D] text-white rounded text-l font-medium hover:bg-[#014c78] transition"
                            >
                              Google Scholar
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 11-2 0V5.414l-9.293 9.293a1 1 0 01-1.414-1.414L14.586 4H11a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </div>
                        ) : (
                          <div className="pl-6 mt-1 text-sm text-gray-500 italic">No URL available</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">No references provided.</p>
                );
              })() : (
                <p className="text-gray-700">No references or URLs available.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleJournalPageClient;