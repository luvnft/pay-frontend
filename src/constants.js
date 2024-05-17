export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://payrollpal.fly.dev"
    : "https://pay-backend.vercel.app/";
