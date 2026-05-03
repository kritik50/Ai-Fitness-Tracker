import "dotenv/config";
import { generateCoachInsights } from "./src/services/gemini";

async function main() {
    try {
        const insights = await generateCoachInsights("User goal: lose weight\n...");
        console.dir(insights, { depth: null });
    } catch (e) {
        console.error(e);
    }
}
main();
