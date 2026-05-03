import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "test",
        });
        console.log(response.text);
    } catch (e) {
        console.error(e);
    }
}
main();
