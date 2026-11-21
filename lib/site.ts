export const PRODUCTION_HOST = "zarep.my";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${PRODUCTION_HOST}`;

/** Anything that is not the production host (e.g. staging.zarep.my) must stay out of search results. */
export const isProduction = new URL(siteUrl).hostname === PRODUCTION_HOST;
