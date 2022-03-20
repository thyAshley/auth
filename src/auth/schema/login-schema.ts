import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6),
});
