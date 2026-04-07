
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { SignupBody, LoginBody } from "./auth.types";

const DUMMY_HASH = "$2a$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu";

export async function signupService(body: SignupBody) {
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return null;

  const hash = await bcrypt.hash(body.password, 10);
  const user = await prisma.user.create({
    data: { email: body.email, fullname: body.fullname, password: hash },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function loginService(body: LoginBody) {
  const user = await prisma.user.findUnique({ where: { email: body.email } });

  // Proteção contra timing attack: bcrypt roda sempre
  const hash = user?.password ?? DUMMY_HASH;
  const valid = await bcrypt.compare(body.password, hash);

  if (!user || !valid) return null;
  return user;
}