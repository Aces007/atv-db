import React, { useState, useEffect } from "react";

const formatCitation = (data, style) => {
    const { authors, title, publicationDate, pageCount } = data;
    const doi = data.doi || "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1936-4490.2001.tb00260.x";
    const authorText = authors.map((a) => `${a.lastName}, ${a.firstName.charAt(0)}.`).join(", ");
    const fullAuthorTextMLA = authors.map((a) => `${a.firstName} ${a.lastName}`).join(", ");
    const year = publicationDate?.year || "n.d.";
    const formattedDate = `${year}`;
    const journal = "Polytechnic University of the Philippines";
    const volume = "18";
    const issue = "4";
    const pages = `${pageCount}`;

    switch (style) {
        case "APA":
            return `${authorText} (${formattedDate}). ${title}. ${journal}, ${volume}(${issue}), ${pages}. ${doi}`;
        case "MLA":
            return `${fullAuthorTextMLA}. “${title}.” ${journal}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}, ${doi}.`;
        case "Chicago":
            return `${fullAuthorTextMLA}. "${title}." ${journal} ${volume}, no. ${issue} (${year}): ${pages}. ${doi}`;
        default:
            return "";
    }
};

const CitationModal = ({ isOpen, onClose, materialData }) => {
    const [citationStyle, setCitationStyle] = useState("APA");
    const [citation, setCitation] = useState("");

    useEffect(() => {
        if (materialData) {
            const formatted = formatCitation(materialData, citationStyle);
            setCitation(formatted);
        }
    }, [citationStyle, materialData]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close">✕</button>

                <div className="radio-group my-4">
                    <label>
                        <input
                            type="radio"
                            value="APA"
                            checked={citationStyle === "APA"}
                            onChange={() => setCitationStyle("APA")}
                        /> APA
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="MLA"
                            checked={citationStyle === "MLA"}
                            onChange={() => setCitationStyle("MLA")}
                        /> MLA
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Chicago"
                            checked={citationStyle === "Chicago"}
                            onChange={() => setCitationStyle("Chicago")}
                        /> Chicago
                    </label>
                </div>

                <div className="citation-box bg-gray-100 p-4 rounded">
                    <p className="text-sm whitespace-pre-wrap">{citation}</p>
                </div>
            </div>
        </div>
    );
};

export default CitationModal;
