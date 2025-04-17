import React, { useState, useEffect, useRef } from "react";

const formatCitation = (data, style) => {
    const { authors, title, publicationDate, pageCount, doi } = data;
    const citationDOI = doi || "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1936-4490.2001.tb00260.x";
    const authorText = authors.map((a) => `${a.lastName}, ${a.firstName.charAt(0)}.`).join(", ");
    const fullAuthorTextMLA = authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
    const year = publicationDate?.year || "n.d.";
    const journal = "Polytechnic University of the Philippines";
    const volume = "18";
    const issue = "4";
    const pages = `${pageCount}`;

    switch (style) {
        case "APA":
            return `${authorText} (${year}). ${title}. ${journal}, ${volume}(${issue}), ${pages}. ${citationDOI}`;
        case "MLA":
            return `${fullAuthorTextMLA}. “${title}.” ${journal}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}, ${citationDOI}.`;
        case "Chicago":
            return `${fullAuthorTextMLA}. "${title}." ${journal} ${volume}, no. ${issue} (${year}): ${pages}. ${citationDOI}`;
        default:
            return "";
    }
};

const CitationModal = ({ isOpen, onClose, materialData }) => {
    const [citationStyle, setCitationStyle] = useState("APA");
    const [citation, setCitation] = useState("");
    const modalRef = useRef(null);

    useEffect(() => {
        if (materialData) {
            const formatted = formatCitation(materialData, citationStyle);
            setCitation(formatted);
        }
    }, [citationStyle, materialData]);

    // Close on outside click
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(citation);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl">✕</button>

                <div className="my-4 space-x-4">
                    {["APA", "MLA", "Chicago"].map(style => (
                        <label key={style}>
                            <input
                                type="radio"
                                value={style}
                                checked={citationStyle === style}
                                onChange={() => setCitationStyle(style)}
                                className="mr-1"
                            />
                            {style}
                        </label>
                    ))}
                </div>

                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="text-sm whitespace-pre-wrap">{citation}</p>
                </div>

                <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Copy Citation
                </button>
            </div>
        </div>
    );
};

export default CitationModal;
