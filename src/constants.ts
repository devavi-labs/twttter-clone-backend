export const __prod__ = process.env.NODE_ENV === "production";

if (!__prod__) {
  require("dotenv").config();
}
export const PORT = process.env.PORT || 2608;

export const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
export const ENDPOINT = process.env.ENDPOINT || "http://localhost:" + PORT;

export const DATABASE_URL = process.env.DATABASE_URL;
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const DATABASE_USER = process.env.DATABASE_USER;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "qat";
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || "qrt";

export const DEFAULT_DP = "https://picsum.photos/400";
export const DEFAULT_CP = "https://picsum.photos/1200";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const NYTIMES_ENDPOINT = process.env.NYTIMES_ENDPOINT;
export const NYTIMES_API_KEY = process.env.NYTIMES_API_KEY;
