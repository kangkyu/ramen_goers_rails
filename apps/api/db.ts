import { neon } from "@neondatabase/serverless";

// Export a Neon SQL client if DATABASE_URL is configured; otherwise null for fallback
export const sql = (() => {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return null;
    return neon(url);
  } catch {
    return null;
  }
})();
