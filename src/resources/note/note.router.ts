
import { Router } from "express";
import { isAuth } from "../../middlewares/isAuth";
import { validateBody } from "../../middlewares/validateBody";
import { noteSchema } from "./note.schema";
import { getAll, getOne, create, update, remove } from "./note.controller";

const noteRouter = Router();

noteRouter.use(isAuth); // todas as rotas de notas exigem sessão

noteRouter.get("/", getAll);
noteRouter.post("/", validateBody(noteSchema), create);
noteRouter.get("/:id", getOne);
noteRouter.put("/:id", validateBody(noteSchema), update);
noteRouter.delete("/:id", remove);

export default noteRouter;