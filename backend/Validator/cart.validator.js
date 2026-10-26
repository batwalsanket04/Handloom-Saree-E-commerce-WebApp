import Joi from "joi";

export const cartItemSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const emptyCartBodySchema = Joi.object({});