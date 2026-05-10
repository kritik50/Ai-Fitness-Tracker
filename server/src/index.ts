import type { Core } from '@strapi/strapi';

const AUTHENTICATED_PERMISSIONS = [
  // Food Log
  { action: 'api::food-log.food-log.create' },
  { action: 'api::food-log.food-log.find' },
  { action: 'api::food-log.food-log.findOne' },
  { action: 'api::food-log.food-log.update' },
  { action: 'api::food-log.food-log.delete' },
  // Activity Log
  { action: 'api::activity-log.activity-log.create' },
  { action: 'api::activity-log.activity-log.find' },
  { action: 'api::activity-log.activity-log.findOne' },
  { action: 'api::activity-log.activity-log.update' },
  { action: 'api::activity-log.activity-log.delete' },
  // Profile (custom route)
  { action: 'api::profile.profile.updateMe' },
  // AI Coach (custom route)
  { action: 'api::ai-coach.ai-coach.insight' },
  // Image Analysis (custom route)
  { action: 'api::image-analysis.image-analysis.analyze' },
  // Users
  { action: 'plugin::users-permissions.user.me' },
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setAuthenticatedPermissions(strapi);
  },
};

async function setAuthenticatedPermissions(strapi: Core.Strapi) {
  try {
    // Find the "Authenticated" role
    const authenticatedRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'authenticated' } });

    if (!authenticatedRole) {
      strapi.log.warn('[bootstrap] Could not find "authenticated" role — skipping permission setup.');
      return;
    }

    // Get existing permissions for this role
    const existingPermissions: Array<{ action: string }> = await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: authenticatedRole.id } });

    const existingActions = new Set(existingPermissions.map((p) => p.action));

    // Only insert permissions that don't already exist
    const toCreate = AUTHENTICATED_PERMISSIONS.filter(
      (p) => !existingActions.has(p.action)
    );

    for (const perm of toCreate) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action: perm.action,
          role: authenticatedRole.id,
        },
      });
      strapi.log.info(`[bootstrap] Granted permission: ${perm.action}`);
    }

    if (toCreate.length === 0) {
      strapi.log.info('[bootstrap] All permissions already set — nothing to do.');
    } else {
      strapi.log.info(`[bootstrap] Set ${toCreate.length} new permissions for "authenticated" role.`);
    }
  } catch (err) {
    strapi.log.error('[bootstrap] Failed to set permissions:', err);
  }
}
