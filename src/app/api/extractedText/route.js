import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const data = await pdfParse(buffer);
        return new Response(JSON.stringify({ text: data.text }), { status: 200 });
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return new Response(JSON.stringify({ error: "Failed to parse PDF" }), { status: 500 });
    }
}
