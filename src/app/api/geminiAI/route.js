import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure this runs in Node.js environment

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY);


export async function POST(req) {
    try {
        if (req.method !== "POST") {
            return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
        }

        //  Receive the file dynamically from request (Not from local storage)
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No File Uploaded" }, { status: 400 });
        }

        //  Convert file to buffer (instead of accessing local files)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        //  Extract text from PDF
        const pdfData = await pdfParse(buffer);
        const extractedText = pdfData.text;

        console.log("📜 Extracted PDF Text:", extractedText);

        //  Send extracted text to GEMINI AI
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(extractedText);
        const aiResult = await response.text();

        return NextResponse.json({ extractedText, aiResult }, { status: 200 });
    } catch (error) {
        console.error("Error processing PDF & Gemini AI:", error);
        return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
    }
}

export async function GET() {
    console.log("API Route Hit");
    return new Response(JSON.stringify({ message: "API is working" }), { status: 200 });
}
