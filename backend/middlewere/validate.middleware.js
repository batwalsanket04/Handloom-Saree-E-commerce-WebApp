const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};

    error.details.forEach((detail) => {
      const field = detail.path[0] || "_";
      errors[field] = detail.message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  req.body = value;
  return next();
};

export default validate;