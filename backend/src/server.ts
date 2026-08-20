import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/courses";
import tutorRoutes from "./routes/tutor";
import playgroundRoutes from "./routes/playground";
import standardRoutes from "./routes/standards";
import prisma from "./db";
import http from "http";
import https from "https";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*", // Adjust for specific origins in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/playground", playgroundRoutes);
app.use("/api/standards", standardRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Debug env check (safe - only shows key presence, not value)
app.get("/debug/env", (req: any, res: any) => {
  res.json({
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV || "not set"
  });
});

// Debug: test Gemini API directly and return raw result
app.get("/debug/gemini-test", async (req: any, res: any) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return res.json({ error: "No GEMINI_API_KEY set" });
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Say hello in one sentence" }] }]
        })
      }
    );
    const data = await geminiRes.json();
    res.json({ status: geminiRes.status, data });
  } catch (err: any) {
    res.json({ error: err.message });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`[ENV] GEMINI_API_KEY loaded: ${!!process.env.GEMINI_API_KEY} (length: ${process.env.GEMINI_API_KEY?.length || 0})`);
  console.log(`[ENV] OPENAI_API_KEY loaded: ${!!process.env.OPENAI_API_KEY}`);

  // ============================================
  // KEEP-ALIVE SYSTEM
  // Prevents Supabase from pausing (pings DB every 4 days)
  // Prevents Render from sleeping (self-pings every 14 minutes)
  // ============================================

  // 1. Ping the database every 4 days to keep Supabase active
  const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("[Keep-Alive] ✅ Database pinged successfully - Supabase stays awake!");
    } catch (err) {
      console.error("[Keep-Alive] ❌ Database ping failed:", err);
    }
  }, FOUR_DAYS_MS);

  // 2. Self-ping every 14 minutes to prevent Render free tier from sleeping
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL || "";
  if (RENDER_URL) {
    const FOURTEEN_MINS_MS = 14 * 60 * 1000;
    setInterval(() => {
      const url = `${RENDER_URL}/health`;
      const requester = url.startsWith("https") ? https : http;
      requester.get(url, (res) => {
        console.log(`[Keep-Alive] ✅ Self-ping sent to Render (status: ${res.statusCode}) - Server stays awake!`);
      }).on("error", (err) => {
        console.error("[Keep-Alive] ❌ Self-ping failed:", err.message);
      });
    }, FOURTEEN_MINS_MS);
  }
});
