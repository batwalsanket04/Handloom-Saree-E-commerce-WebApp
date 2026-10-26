import express from "express";
import { submitContact } from "../controller/contactController.js";
import validate from "../middlewere/validate.middleware.js";
import { contactSchema } from "../Validator/contact.validator.js";

const router = express.Router();

router.post("/", validate(contactSchema), submitContact);

export default router;
