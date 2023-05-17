const { body } = require("express-validator");

const drinkFormSanitization = [
  //validation and sanitization of fields
  body("name", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Drink name must be at least 1 character long")
    .escape()
    .withMessage("Drink name must be specified.")
    .isAlphanumeric("en-US", { ignore: /\s|\-/g })
    .withMessage("Drink name has non-alphanumeric characters."),
  body("brand", "Brand must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name must be at least 1 character long")
    .escape()
    .withMessage("Brand name must be specified.")
    .isAlphanumeric("en-US", { ignore: /\s|\-/g })
    .withMessage("Brand name has non-alphanumeric characters."),
  body("description").trim().escape(),
];

module.exports = { drinkFormSanitization };
