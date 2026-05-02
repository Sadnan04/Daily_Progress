import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import trackerRoutes from "./routes/trackerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/daily_progress_tracker";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const CLIENT_ORIGINS = [
  ...new Set(
    CLIENT_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  )
];
const LOCALHOST_ORIGIN_RE = /^https?:\/\/localhost:\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / non-browser clients (no Origin header).
      if (!origin) return callback(null, true);

      // Allow explicit origins from env (supports comma-separated list).
      if (CLIENT_ORIGINS.includes(origin)) return callback(null, true);

      // Dev convenience: Vite may switch ports (5173 -> 5174, etc).
      if (LOCALHOST_ORIGIN_RE.test(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/notifications", notificationRoutes);

async function main() {
  if (!process.env.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not set. Using insecure default for development.");
    process.env.JWT_SECRET = "dev-only-change-me";
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    // Common Atlas failure on restricted networks: SRV DNS lookup blocked/refused.
    if (
      MONGODB_URI.startsWith("mongodb+srv://") &&
      err &&
      typeof err === "object" &&
      err.code === "ECONNREFUSED" &&
      err.syscall === "querySrv"
    ) {
      console.error(
        [
          "MongoDB Atlas connection failed (SRV DNS lookup refused).",
          "This is usually caused by DNS/VPN/firewall restrictions on your network.",
          "",
          "Fix options:",
          "- Try a different network / disable VPN, or set DNS to 1.1.1.1 or 8.8.8.8 then run `ipconfig` to flush the DNS cache",
          "- Or switch MONGODB_URI to a non-SRV Atlas connection string (mongodb://...host1,host2,host3...)",
          "- Or use local MongoDB: mongodb://127.0.0.1:27017/daily_progress_tracker"
        ].join("\n")
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  }
  app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
