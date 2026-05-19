// Cage Logic V1 project-wide constants.
// V1 is single-user (Chris) at a single gym (Iron Army Academy).

/**
 * UUID of the Iron Army Academy gym row in the `public.gyms` table.
 * Seeded by hand; see docs/cageside-v1-cowork-starter.md ("Iron Army gym record").
 *
 * V1.5+ replaces this with a gym-selector during onboarding.
 */
export const IRON_ARMY_GYM_ID = 'fd3e2b25-99d7-4e00-aec7-272ba5f48702' as const;

/**
 * Days of data required before the Investment Score becomes a real number.
 * Until this is reached, the score displays "ramping..." instead of a value.
 */
export const RAMPING_DAYS = 30;
