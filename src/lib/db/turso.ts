import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const tursoConfig = {
    url: process.env.VITE_TURSO_DATABASE_URL!,
    authToken: process.env.VITE_TURSO_AUTH_TOKEN!,
};

export const turso = createClient(tursoConfig);