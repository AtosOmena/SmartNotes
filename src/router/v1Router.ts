
import { Router } from "express";
import authRouter from "../resources/auth/auth.router";
import noteRouter from "../resources/note/note.router";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/notes", noteRouter);

export default v1Router;