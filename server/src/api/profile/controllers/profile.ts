type AuthenticatedUser = {
    id: number;
};

type ProfilePayload = {
    age?: number;
    weight?: number;
    height?: number | null;
    goal?: "lose" | "maintain" | "gain";
    dailyCalorieIntake?: number;
    dailyCalorieBurn?: number;
};

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }

    const {
        password,
        resetPasswordToken,
        confirmationToken,
        ...safeUser
    } = user;

    void password;
    void resetPasswordToken;
    void confirmationToken;

    return safeUser;
};

export default ({ strapi }) => ({
    async updateMe(ctx) {
        const user = ctx.state.user as AuthenticatedUser | undefined;

        if (!user) {
            return ctx.unauthorized("Login required");
        }

        const body = (ctx.request.body || {}) as ProfilePayload;
        const data: ProfilePayload = {
            age: body.age,
            weight: body.weight,
            height: body.height ?? null,
            goal: body.goal,
            dailyCalorieIntake: body.dailyCalorieIntake,
            dailyCalorieBurn: body.dailyCalorieBurn,
        };

        const updatedUser = await strapi.db
            .query("plugin::users-permissions.user")
            .update({
                where: { id: user.id },
                data,
            });

        return ctx.send(sanitizeUser(updatedUser));
    },
});
