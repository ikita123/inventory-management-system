const { body, validationResult } = require("express-validator");

exports.inventoryValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("quantity").isNumeric().withMessage("Quantity must be a number"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
