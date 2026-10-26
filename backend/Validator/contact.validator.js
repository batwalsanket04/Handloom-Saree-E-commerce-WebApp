import Joi from "joi";

export const contactSchema = Joi.object({
  uname: Joi.string().trim().min(1).max(255).required(),
  email: Joi.string().trim().email().lowercase().required(),
  phone: Joi.string().trim().min(7).max(32).required(),
  message: Joi.string().trim().min(1).max(5000).required(),
});
