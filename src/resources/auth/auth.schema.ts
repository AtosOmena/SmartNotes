
import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  fullname: Joi.string().max(100).required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[0-9]/, "number")
    .pattern(/[^a-zA-Z0-9]/, "special character")
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});