import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  TMDB_API_BASE_URL: process.env.TMDB_API_BASE_URL,
  TMDB_API_KEY: process.env.TMBD_API_KEY,
  TMDB_JWT: process.env.TMDB_JWT
} as const;