
import express from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import router from "./router";

const app = express();

// ─── Segurança: helmet ────────────────────────────────────────────
app.use(
  helmet({
    xPoweredBy: false,            // remove X-Powered-By
    noSniff: true,                // X-Content-Type-Options: nosniff
    hsts: true,                   // Strict-Transport-Security
  })
);

// ─── CORS ─────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ─── Rate limit global: 100 req / 15 min por IP ───────────────────
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ─── Body parser ─────────────────────────────────────────────────
app.use(express.json());

// ─── Sessão ──────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

// ─── Rotas ───────────────────────────────────────────────────────
app.use(router);

export default app;