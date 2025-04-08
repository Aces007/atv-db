import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; 

const GEMINI_API_KEY = AIzaSyCBFhKNpLMefZn79RaYgzgNswD1XM-gaf8;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)


console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY);


export async function POST(req) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No File Uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const pdfData = await pdfParse(buffer);
        let extractedText = pdfData.text;

        console.log("Extracted PDF Text Length:", extractedText.length);

        const MAX_INPUT_TOKENS = 5000;
        if (extractedText.length > MAX_INPUT_TOKENS) {
            extractedText = extractedText.slice(0, MAX_INPUT_TOKENS) + "... (truncated)";
        }

        const prompt = `
            Extract the following fields in JSON format:
            {
                "title": "",
                "authors": [{"firstName": "", "lastName": ""}],
                "abstract": "",
                "materialType": ""
            }

            Content:
            ${extractedText}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);

        const response = await result.response;

        const rawText = await response.text();

        let cleanedText = rawText.replace(/```json|```/g, "").trim();

        let jsonParsed;
        try {
            jsonParsed = JSON.parse(cleanedText);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", cleanedText);
            throw new Error("Invalid response format. Expected JSON.");
        }

        console.log("Gemini AI Response Preview:", cleanedText.slice(0, 200));
        return NextResponse.json({ extractedText, aiResult: jsonParsed }, { status: 200 });

    } catch (error) {
        console.error("Error processing PDF & Gemini AI:", error.message);
        return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 });
    }
}

export async function GET() {
    return new Response(JSON.stringify({ message: "API is working" }), { status: 200 });
}