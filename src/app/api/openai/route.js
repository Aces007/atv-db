import OpenAI from "openai";
import pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Ensure this runs in Node.js environment

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

        //  Send extracted text to OpenAI
        const openaiResponse = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Extract title, authors, abstract, and other details from the given research paper text. Respond in JSON format." },
                { role: "user", content: extractedText },
            ],
        });

        const aiResult = openaiResponse.choices[0].message.content;

        return NextResponse.json({ extractedText, aiResult }, { status: 200 });
    } catch (error) {
        console.error("Error processing PDF & OpenAI:", error);
        return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
    }
}
