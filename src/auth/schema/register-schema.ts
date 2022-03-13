import Joi from "joi";

export const RegisterSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6),
});
