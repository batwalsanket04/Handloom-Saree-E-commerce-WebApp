import Joi from "joi";

const sareeFields = {
  name: Joi.string().trim().min(1).max(255),
  description: Joi.string().trim().allow("").max(10000),
  price: Joi.number().positive(),
  category: Joi.string().trim().min(1).max(255),
  stock: Joi.number().integer().min(0),
};

export const addSareeSchema = Joi.object({
  ...sareeFields,
  name: sareeFields.name.required(),
  price: sareeFields.price.required(),
  category: sareeFields.category.required(),
});

export const updateSareeSchema = Joi.object(sareeFields);