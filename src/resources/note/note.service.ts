
import { prisma } from "../../lib/prisma";
import { NoteBody } from "./note.types";

export async function getAllNotes(userId: string) {
  return prisma.note.findMany({ where: { userId } });
}

export async function getNoteById(id: string, userId: string) {
  return prisma.note.findFirst({ where: { id, userId } });
}

export async function createNote(userId: string, body: NoteBody) {
  return prisma.note.create({ data: { userId, ...body } });
}

export async function updateNote(id: string, userId: string, body: NoteBody) {
  const note = await prisma.note.findFirst({ where: { id, userId } });
  if (!note) return null;
  return prisma.note.update({ where: { id }, data: body });
}

export async function deleteNote(id: string, userId: string) {
  const note = await prisma.note.findFirst({ where: { id, userId } });
  if (!note) return null;
  return prisma.note.delete({ where: { id } });
}