
import { Request, Response, NextFunction } from "express";

export function isAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = (req.session as any).userId as string | undefined;
  if (!userId) {
    res.status(401).json({ msg: "Usuário não autenticado" });
    return;
  }
  next();
}