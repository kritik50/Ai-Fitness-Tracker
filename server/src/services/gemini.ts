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
            items: { type: "string" },
            minItems: 3,
            maxItems: 3,
        },
    },
    required: ["tips"],
};

export const analyzeFoodImage = async (filePath: string, mimeType: string) => {
    const base64ImageFile = fs.readFileSync(filePath, { encoding: "base64" });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            { inlineData: { mimeType, data: base64ImageFile } },
            { text: "Extract the food name and estimated calories from this image in a JSON object." },
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
        contents: [{ text: summary }],
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
            ? parsed.tips.map((tip) => tip.trim()).filter(Boolean).slice(0, 3)
            : [],
    };
};

// ── NEW ────────────────────────────────────────────────────────
// Simple calorie estimator — one Gemini call, tiny prompt,
// returns a single integer so it's cheap and fast.
export const estimateFoodCalories = async (foodName: string): Promise<number> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                text: `Estimate the calories for one standard serving of: "${foodName}". Return only a JSON object.`,
            },
        ],
        config: {
            systemInstruction:
                "You are a nutrition database. Return the estimated calorie count for one typical serving of the food the user describes. Be concise and accurate.",
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    calories: { type: "number" },
                },
                required: ["calories"],
            },
            temperature: 0.1,
        },
    });

    const parsed = JSON.parse(response.text) as { calories: number };
    return Math.round(parsed.calories);
};