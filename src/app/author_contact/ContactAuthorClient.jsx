"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "../header/page";
import Footer from "../footer/page";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function ContactAuthorClient() {
  const searchParams = useSearchParams();
  const authorEmail = searchParams.get("author");
  const articleTitle = searchParams.get("title");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("Please log in to send a request.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("ContactRequests").insert([
      {
        user_id: user.id,
        author_email: authorEmail,
        article_title: articleTitle,
        message,
      },
    ]);

    if (error) {
      toast.error("Failed to send message.");
      console.error(error);
      setSubmitting(false);
      return;
    }

    toast.success("✅ Message sent to author! Redirecting...", {
      duration: 3000,
    });

    setMessage("");
    setSubmitting(false);

    setTimeout(() => {
      window.location.href = `/article_journalpage?title=${encodeURIComponent(
        articleTitle
      )}`;
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-white font-redhat">
      <Header />
      <main className="flex-1 px-4 py-12 flex justify-center items-center">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl px-8 py-10 sm:p-12 transition-all duration-300">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            📩 Contact Author
          </h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            You are reaching out to{" "}
            <span className="font-semibold text-red-700">{authorEmail}</span>{" "}
            regarding the article:{" "}
            <span className="italic text-gray-800">{articleTitle}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-2 w-full border border-gray-300 focus:ring-red-600 focus:border-red-600 rounded-xl p-4 h-40 resize-none shadow-sm transition duration-200"
                placeholder="Write your message to the author here..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`${
                  submitting
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800"
                } text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200`}
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
