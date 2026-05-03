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

const formatDate = (value?: string | Date | null) => {
    if (!value) {
        return "unknown-date";
    }

    if (value instanceof Date) {
        return value.toISOString().split("T")[0];
    }

    return value.split("T")[0];
};

const sumCalories = (entries: LogEntry[]) =>
    entries.reduce((total, entry) => total + Number(entry.calories || 0), 0);

const sumDuration = (entries: LogEntry[]) =>
    entries.reduce((total, entry) => total + Number(entry.duration || 0), 0);

export default ({ strapi }) => ({
    async insight(ctx) {
        const user = ctx.state.user as CoachUser | undefined;

        if (!user) {
            return ctx.unauthorized("Login required");
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const fromDate = sevenDaysAgo.toISOString();

        const [foodLogs, activityLogs] = await Promise.all([
            strapi.documents("api::food-log.food-log").findMany({
                filters: {
                    users_permissions_user: user.id,
                    createdAt: {
                        $gte: fromDate,
                    },
                },
                sort: ["createdAt:asc"],
                fields: ["name", "mealType", "calories", "createdAt"],
            }),
            strapi.documents("api::activity-log.activity-log").findMany({
                filters: {
                    users_permissions_user: user.id,
                    createdAt: {
                        $gte: fromDate,
                    },
                },
                sort: ["createdAt:asc"],
                fields: ["name", "duration", "calories", "createdAt"],
            }),
        ]);

        const foodSummary =
            foodLogs.length > 0
                ? foodLogs
                      .map((entry) =>
                          `${formatDate(entry.createdAt)} | ${entry.mealType || "meal"} | ${entry.name || "Unknown food"} | ${Number(entry.calories || 0)} kcal`
                      )
                      .join("\n")
                : "No food logs recorded in the last 7 days.";

        const activitySummary =
            activityLogs.length > 0
                ? activityLogs
                      .map((entry) =>
                          `${formatDate(entry.createdAt)} | ${entry.name || "Activity"} | ${Number(entry.duration || 0)} min | ${Number(entry.calories || 0)} kcal burned`
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

        const result = await generateCoachInsights(prompt);

        return ctx.send({
            tips: result.tips,
        });
    },
});
