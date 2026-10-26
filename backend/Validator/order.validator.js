import Joi from "joi";

const idSchema = Joi.number().integer().positive();

const addressSchema = Joi.object({
  fname: Joi.string().trim().allow("").max(255),
  lname: Joi.string().trim().allow("").max(255),
  uname: Joi.string().trim().allow("").max(255),
  name: Joi.string().trim().allow("").max(255),
  uemail: Joi.string().trim().email().allow(""),
  email: Joi.string().trim().email().allow(""),
  street: Joi.string().trim().allow("").max(1000),
  city: Joi.string().trim().allow("").max(255),
  state: Joi.string().trim().allow("").max(255),
  code: Joi.string().trim().allow("").max(32),
  country: Joi.string().trim().allow("").max(255),
  phone: Joi.string().trim().allow("").max(32),
}).min(1);

const orderItemSchema = Joi.object({
  id: idSchema,
  _id: idSchema,
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().allow("").max(10000),
  category: Joi.string().allow("").max(255),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().positive().required(),
  image: Joi.string().allow("").max(2000),
  stock: Joi.number().integer().min(0),
  sellerId: idSchema.allow(null),
}).or("id", "_id");

const orderFields = {
  items: Joi.array().items(orderItemSchema).min(1).required(),
  amount: Joi.number().positive().required(),
  address: addressSchema.required(),
};

export const placeOrderSchema = Joi.object({
  ...orderFields,
  paymentMethod: Joi.string().valid("stripe", "cod"),
});

export const placeCodOrderSchema = Joi.object(orderFields);

export const verifyOrderSchema = Joi.object({
  orderId: idSchema.required(),
  success: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid("true", "false")
  ).required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Order Processing", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled")
    .required(),
});