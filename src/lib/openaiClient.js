import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

export const chatGPTRequest = async (prompt) => {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Extract title, authors, abstract, and other details from the given research paper text." },
                { role: "user", content: prompt },
            ],
            
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return "Error fetching response.";
    }
};
