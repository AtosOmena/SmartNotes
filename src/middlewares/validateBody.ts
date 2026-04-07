
import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(422).json({ errors: error.details.map((d) => d.message) });
      return;
    }
    next();
  };
}