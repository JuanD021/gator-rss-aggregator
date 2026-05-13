import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config.js";

const configFile = readConfig();

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: configFile.dbUrl,
  },
});
