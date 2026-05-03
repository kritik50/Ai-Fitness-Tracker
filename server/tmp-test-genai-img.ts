import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
    fs.writeFileSync("test.txt", "hello");
    const base64ImageFile = fs.readFileSync("test.txt", {
        encoding: "base64",
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    inlineData: {
                        mimeType: "text/plain",
                        data: base64ImageFile,
                    },
                },
                {
                    text: "What is this file?",
                },
            ] as any,
        });
        console.log(response.text);
    } catch (e) {
        console.error("ERROR:");
        console.error(e.message);
    }
}
main();
