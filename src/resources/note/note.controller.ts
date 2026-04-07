
import { Request, Response } from "express";
import * as noteService from "./note.service";
import { NoteBody } from "./note.types";

export async function getAll(req: Request, res: Response): Promise<void> {
  const userId = (req.session as any).userId as string;
  const notes = await noteService.getAllNotes(userId);
  res.status(200).json(notes);
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const userId = (req.session as any).userId as string;
  const id = req.params.id as string;
  const note = await noteService.getNoteById(id, userId);
  if (!note) { res.status(404).json({ msg: "Nota não encontrada" }); return; }
  res.status(200).json(note);
}

export async function create(req: Request, res: Response): Promise<void> {
  const userId = (req.session as any).userId as string;
  const note = await noteService.createNote(userId, req.body as NoteBody);
  res.status(201).json(note);
}

export async function update(req: Request, res: Response): Promise<void> {
  const userId = (req.session as any).userId as string;
  const id = req.params.id as string;
  const note = await noteService.updateNote(id, userId, req.body as NoteBody);
  if (!note) { res.status(404).json({ msg: "Nota não encontrada" }); return; }
  res.status(200).json(note);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const userId = (req.session as any).userId as string;
  const id = req.params.id as string;
  const result = await noteService.deleteNote(id, userId);
  if (!result) { res.status(404).json({ msg: "Nota não encontrada" }); return; }
  res.status(204).send();
}