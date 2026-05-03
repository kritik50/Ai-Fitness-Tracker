import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type CoachInsightsResponse = {
    tips: string[];
};

const coachInsightsSchema = {
    type: "object",
    properties: {
        tips: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 3,
            maxItems: 3,
        },
    },
    required: ["tips"],
};

export const analyzeFoodImage = async (filePath: string, mimeType: string) => {
    const base64ImageFile = fs.readFileSync(filePath, {
        encoding: "base64",
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                inlineData: {
                    mimeType,
                    data: base64ImageFile,
                },
            },
            {
                text: "Extract the food name and estimated calories from this image in a JSON object.",
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    calories: { type: "number" },
                },
                required: ["name", "calories"],
            },
        },
    });

    return JSON.parse(response.text) as { name: string; calories: number };
};

export const generateCoachInsights = async (summary: string) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                text: summary,
            },
        ],
        config: {
            systemInstruction:
                "Act as a fitness coach. Look at this 7-day user data and provide 3 short, highly specific insights or tips to help them hit their fitness goals.",
            responseMimeType: "application/json",
            responseSchema: coachInsightsSchema,
            temperature: 0.4,
        },
    });

    const parsed = JSON.parse(response.text) as CoachInsightsResponse;

    return {
        tips: Array.isArray(parsed.tips)
            ? parsed.tips
                  .map((tip) => tip.trim())
                  .filter(Boolean)
                  .slice(0, 3)
            : [],
    };
};
