import OpenAI from "openai";
import pdfParse from "pdf-parse";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

console.log("OPENAI API KEY:", process.env.OPENAI_API_KEY);


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
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "user",
                content: `
                    Extract the following fields in JSON format:
                    {
                        "title": "",
                        "authors": [{"firstName": "", "lastName": ""}],
                        "abstract": "",
                        "materialType": ""
                    }
                    
                    Content:
                    ${extractedText}`,
              },
            ],
            temperature: 0.2,
          });
        
        let aiResult = response.choices[0].message.content.trim();

        aiResult = aiResult.replace(/```json|```/g, "").trim();

        let jsonParsed;

        try {
            jsonParsed = JSON.parse(aiResult);
        } catch (e) {
            console.error("Failed to parse Gemini response as JSON:", aiResult);
            throw new Error("Invalid response format. Expected JSON.");
        }

        console.log("Gemini AI Response Preview:", aiResult?.slice(0, 200));
        return NextResponse.json({ extractedText, aiResult: jsonParsed }, { status: 200 });
        
    } catch (error) {
        console.error(" Error processing PDF & Gemini AI:", error.message);
        return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 });
    }
}

export async function GET() {
    return new Response(JSON.stringify({ message: "API is working" }), { status: 200 });
}