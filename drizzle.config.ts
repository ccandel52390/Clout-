import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  tablesFilter: ["clout_*"],
  dbCredentials: {
    url: process.env.TEAM_DB_URL!,
    authToken: process.env.TEAM_DB_AUTH_TOKEN,
  },
});
