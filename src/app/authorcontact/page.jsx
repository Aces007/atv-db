"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "../header/page";
import Footer from "../footer/page";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function ContactAuthor() {
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
    } else {
      toast.success("Request sent to author!");
      setMessage("");
    }

    setSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-redhat bg-gray-50">
      <Header />
      <main className="flex-1 p-8 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Contact Author</h1>
          <p className="mb-4 text-gray-600">
            You're contacting <strong>{authorEmail}</strong> regarding the article: <em>{articleTitle}</em>
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="text-gray-700 font-semibold">Your Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-2 w-full border border-gray-300 rounded-lg p-4 h-40"
                placeholder="Explain your request clearly..."
              ></textarea>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-sm font-semibold"
            >
              {submitting ? "Sending..." : "Send Request"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

