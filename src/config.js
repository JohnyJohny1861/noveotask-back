import path from "path";

export const UPLOADS_DIR = path.join(process.cwd(), "uploads");
export const PORT = process.env.PORT ? process.env.PORT : 3655;