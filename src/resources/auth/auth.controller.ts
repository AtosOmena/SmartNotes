
import { Request, Response } from "express";
import { signupService, loginService } from "./auth.service";
import { SignupBody, LoginBody } from "./auth.types";

export async function signup(req: Request, res: Response): Promise<void> {
  const body: SignupBody = req.body;
  const user = await signupService(body);
  if (!user) {
    res.status(400).json({ msg: "E-mail já cadastrado" });
    return;
  }
  res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<void> {
  const body: LoginBody = req.body;
  const user = await loginService(body);
  if (!user) {
    res.status(401).json({ msg: "Credenciais inválidas" });
    return;
  }
  (req.session as any).userId = user.id;
  res.status(200).json({ msg: "Usuário autenticado" });
}

export async function logout(req: Request, res: Response): Promise<void> {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ msg: "Erro ao encerrar sessão" });
      return;
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ msg: "Sessão encerrada" });
  });
}