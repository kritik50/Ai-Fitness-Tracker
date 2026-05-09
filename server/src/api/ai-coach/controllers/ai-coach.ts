import { generateCoachInsights } from "../../../services/gemini";

type LogEntry = {
    name?: string;
    calories?: number | null;
    duration?: number | null;
    mealType?: string | null;
    createdAt?: string | Date | null;
};

type CoachUser = {
    id: number;
    goal?: string;
    dailyCalorieIntake?: number;
    dailyCalorieBurn?: number;
};

// ─── In-memory cache ───────────────────────────────────────────
// Key: userId, Value: { tips, cachedAt }
// Cache is valid for 10 minutes — refreshing the page reuses it,
// but logging new food/activity within 10 min also reuses it.
// Bump CACHE_TTL_MS if you want a longer window.

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const insightCache = new Map<
    number,
    { tips: string[]; cachedAt: number; logHash: string }
>();

// ─── Helpers ───────────────────────────────────────────────────

const formatDate = (value?: string | Date | null) => {
    if (!value) return "unknown-date";
    if (value instanceof Date) return value.toISOString().split("T")[0];
    return value.split("T")[0];
};

const sumCalories = (entries: LogEntry[]) =>
    entries.reduce((total, e) => total + Number(e.calories || 0), 0);

const sumDuration = (entries: LogEntry[]) =>
    entries.reduce((total, e) => total + Number(e.duration || 0), 0);

// Cheap hash so new logs bust the cache even within the TTL window
const makeLogHash = (foodLogs: LogEntry[], activityLogs: LogEntry[]) =>
    `f${foodLogs.length}_${sumCalories(foodLogs)}_a${activityLogs.length}_${sumDuration(activityLogs)}`;

// ─── Controller ────────────────────────────────────────────────

export default ({ strapi }) => ({
    async insight(ctx) {
        const user = ctx.state.user as CoachUser | undefined;

        if (!user) {
            return ctx.unauthorized("Login required");
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const fromDate = sevenDaysAgo.toISOString();

        // Fetch logs (lightweight — no Gemini call yet)
        const [foodLogs, activityLogs] = await Promise.all([
            strapi.documents("api::food-log.food-log").findMany({
                filters: {
                    users_permissions_user: user.id,
                    createdAt: { $gte: fromDate },
                },
                sort: ["createdAt:asc"],
                fields: ["name", "mealType", "calories", "createdAt"],
            }),
            strapi.documents("api::activity-log.activity-log").findMany({
                filters: {
                    users_permissions_user: user.id,
                    createdAt: { $gte: fromDate },
                },
                sort: ["createdAt:asc"],
                fields: ["name", "duration", "calories", "createdAt"],
            }),
        ]);

        const logHash = makeLogHash(
            foodLogs as LogEntry[],
            activityLogs as LogEntry[]
        );

        // ── Check cache ──────────────────────────────────────────
        const cached = insightCache.get(user.id);
        const now = Date.now();

        if (
            cached &&
            cached.logHash === logHash &&             // same data
            now - cached.cachedAt < CACHE_TTL_MS     // within TTL
        ) {
            return ctx.send({ tips: cached.tips });
        }

        // ── Build prompt ─────────────────────────────────────────
        const foodSummary =
            foodLogs.length > 0
                ? (foodLogs as LogEntry[])
                      .map(
                          (e) =>
                              `${formatDate(e.createdAt)} | ${e.mealType || "meal"} | ${e.name || "Unknown food"} | ${Number(e.calories || 0)} kcal`
                      )
                      .join("\n")
                : "No food logs recorded in the last 7 days.";

        const activitySummary =
            activityLogs.length > 0
                ? (activityLogs as LogEntry[])
                      .map(
                          (e) =>
                              `${formatDate(e.createdAt)} | ${e.name || "Activity"} | ${Number(e.duration || 0)} min | ${Number(e.calories || 0)} kcal burned`
                      )
                      .join("\n")
                : "No activity logs recorded in the last 7 days.";

        const prompt = [
            `User goal: ${user.goal || "maintain"}`,
            `Daily calorie target: ${user.dailyCalorieIntake || 2000} kcal`,
            `Daily burn target: ${user.dailyCalorieBurn || 400} kcal`,
            `7-day food calories total: ${sumCalories(foodLogs as LogEntry[])} kcal`,
            `7-day activity calories burned total: ${sumCalories(activityLogs as LogEntry[])} kcal`,
            `7-day activity minutes total: ${sumDuration(activityLogs as LogEntry[])} min`,
            "",
            "Food logs:",
            foodSummary,
            "",
            "Activity logs:",
            activitySummary,
        ].join("\n");

        // ── Call Gemini ──────────────────────────────────────────
        try {
            const result = await generateCoachInsights(prompt);

            // Store in cache
            insightCache.set(user.id, {
                tips: result.tips,
                cachedAt: now,
                logHash,
            });

            return ctx.send({ tips: result.tips });
        } catch (error: unknown) {
            // If Gemini quota is hit but we have a stale cache, return it
            // rather than showing a raw API error to the user.
            if (cached) {
                console.warn(
                    "[ai-coach] Gemini quota hit — serving stale cache for user",
                    user.id
                );
                return ctx.send({ tips: cached.tips });
            }

            // No cache at all — return a friendly empty response
            console.error("[ai-coach] Gemini error:", error);
            return ctx.send({ tips: [] });
        }
    },
});