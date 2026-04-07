
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Extrai host, port, user, password, database da DATABASE_URL
const url = new URL(process.env.DATABASE_URL as string);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace("/", ""),
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });