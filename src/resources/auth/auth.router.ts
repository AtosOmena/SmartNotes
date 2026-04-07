
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { validateBody } from "../../middlewares/validateBody";
import { isAuth } from "../../middlewares/isAuth";
import { signupSchema, loginSchema } from "./auth.schema";
import { signup, login, logout } from "./auth.controller";

const authRouter = Router();

// Rate limit específico para auth: 10 req / 15 min por IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post("/signup", authLimiter, validateBody(signupSchema), signup);
authRouter.post("/login", authLimiter, validateBody(loginSchema), login);
authRouter.post("/logout", isAuth, logout);

export default authRouter;