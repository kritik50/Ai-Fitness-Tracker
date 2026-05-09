/**
 * food-log controller
 */

import { factories } from '@strapi/strapi';
import { estimateFoodCalories } from '../../../services/gemini';

type AuthenticatedUser = {
    id: number;
};

const getAuthenticatedUser = (ctx): AuthenticatedUser | null => {
    const user = ctx.state.user as AuthenticatedUser | undefined;

    if (!user) {
        ctx.unauthorized('Login required');
        return null;
    }

    return user;
};

export default factories.createCoreController('api::food-log.food-log', ({ strapi }) => ({
    async create(ctx) {
        const user = getAuthenticatedUser(ctx);
        if (!user) return;

        const body = ctx.request.body.data;
        body.users_permissions_user = user.id;
        body.publishedAt = new Date().toISOString();

        const entry = await strapi.documents("api::food-log.food-log").create({ data: body });
        return entry;
    },

    async find(ctx) {
        const user = getAuthenticatedUser(ctx);
        if (!user) return;

        const result = await strapi.documents("api::food-log.food-log").findMany({
            filters: { users_permissions_user: { id: user.id } },
            sort: ["createdAt:desc"],
        });
        return result;
    },

    async findOne(ctx) {
        const user = getAuthenticatedUser(ctx);
        const id = ctx.params.id || ctx.params.documentId;
        if (!user) return;

        const result = await strapi.documents("api::food-log.food-log").findMany({
            filters: { documentId: id, users_permissions_user: { id: user.id } },
        });
        if (!result.length) return ctx.notFound("Not found or not yours");
        return result[0];
    },

    async update(ctx) {
        const user = getAuthenticatedUser(ctx);
        const id = ctx.params.id || ctx.params.documentId;
        if (!user) return;

        const result = await strapi.documents("api::food-log.food-log").findMany({
            filters: { documentId: id, users_permissions_user: { id: user.id } },
        });
        if (!result.length) return ctx.notFound("Not found or not yours");

        return strapi.documents("api::food-log.food-log").update({
            documentId: id,
            data: ctx.request.body.data,
        });
    },

    async delete(ctx) {
        const user = getAuthenticatedUser(ctx);
        const id = ctx.params.id || ctx.params.documentId;
        if (!user) return;

        const result = await strapi.documents("api::food-log.food-log").findMany({
            filters: { documentId: id, users_permissions_user: { id: user.id } },
        });
        if (!result.length) return ctx.notFound("Not found or not yours");

        return strapi.documents("api::food-log.food-log").delete({ documentId: id });
    },

    // ── NEW: POST /api/food-logs/estimate-calories ──────────────
    async estimateCalories(ctx) {
        const user = getAuthenticatedUser(ctx);
        if (!user) return;

        const { name } = ctx.request.body as { name?: string };

        if (!name || !name.trim()) {
            return ctx.badRequest('Food name is required');
        }

        try {
            const calories = await estimateFoodCalories(name.trim());
            return ctx.send({ calories });
        } catch (error) {
            console.error('[estimateCalories]', error);
            return ctx.send({ calories: null });
        }
    },
}));