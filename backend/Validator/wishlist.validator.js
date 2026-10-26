import Joi from "joi";

export const wishlistItemSchema = Joi.object({
  sareeId: Joi.number().integer().positive().required(),
});