import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure this runs in Node.js environment

const GEMINI_API_KEY = AIzaSyCBFhKNpLMefZn79RaYgzgNswD1XM-gaf8;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)


console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY);


export async function POST(req) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
        }

        // Receive File from FormData
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No File Uploaded" }, { status: 400 });
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract Text from PDF
        const pdfData = await pdfParse(buffer);
        let extractedText = pdfData.text;

        console.log("Extracted PDF Text Length:", extractedText.length);

        // Limit Text Size (Gemini API Restriction)
        const MAX_INPUT_TOKENS = 5000; 
        if (extractedText.length > MAX_INPUT_TOKENS) {
            extractedText = extractedText.slice(0, MAX_INPUT_TOKENS) + "... (truncated)";
        }

        // Send Extracted Text to Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(extractedText);
        

        // Validate and Parse Response
        if (!response || typeof response.text !== "function") {
            throw new Error("Unexpected response format from Gemini AI");
        }

        const aiResult = await response.text();

        return NextResponse.json({ extractedText, aiResult }, { status: 200 });
    } catch (error) {
        console.error(" Error processing PDF & Gemini AI:", error.message);
        return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 });
    }
}

export async function GET() {
    return new Response(JSON.stringify({ message: "API is working" }), { status: 200 });
}