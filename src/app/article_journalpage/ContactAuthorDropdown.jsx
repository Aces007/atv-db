import { useState } from "react";
import Link from "next/link";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContactAuthorDropdown({ article }) {
  const [open, setOpen] = useState(false);

  if (!Array.isArray(article.authors) || article.authors.length === 0) return null;

  return (
    <div className="relative inline-block text-left">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        Contact Author
        <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-20 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1 text-sm text-gray-700">
            {article.authors.map((author, i) => (
              <li key={i}>
                <Link
                  href={`/author_contact?author=${encodeURIComponent(
                    author.authorEmail
                  )}&title=${encodeURIComponent(article.title)}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  {author.firstName} {author.lastName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
