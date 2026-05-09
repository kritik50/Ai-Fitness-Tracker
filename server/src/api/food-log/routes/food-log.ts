/**
 * food-log router
 */

export default {
    routes: [
        // ── Core CRUD ──────────────────────────────────────────
        {
            method: "GET",
            path: "/food-logs",
            handler: "food-log.find",
            config: {},
        },
        {
            method: "GET",
            path: "/food-logs/:id",
            handler: "food-log.findOne",
            config: {},
        },
        {
            method: "POST",
            path: "/food-logs",
            handler: "food-log.create",
            config: {},
        },
        {
            method: "PUT",
            path: "/food-logs/:id",
            handler: "food-log.update",
            config: {},
        },
        {
            method: "DELETE",
            path: "/food-logs/:id",
            handler: "food-log.delete",
            config: {},
        },

        // ── Custom: calorie estimator ──────────────────────────
        {
            method: "POST",
            path: "/food-logs/estimate-calories",
            handler: "food-log.estimateCalories",
            config: {},
        },
    ],
};