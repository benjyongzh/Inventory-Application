const { body } = require("express-validator");

const brandFormSanitization = [
  //validation and sanitization of fields
  body("name", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name must be at least 1 character long")
    .escape()
    .withMessage("Brand name must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Brand name has non-alphanumeric characters."),
  body("country", "Country must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country name must be at least 1 character long")
    .escape()
    .withMessage("Country must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Country name has non-alphanumeric characters."),
  body("year_established", "Country must not be empty")
    .optional({ checkFalsy: true })
    .isNumeric()
    .isLength({ min: 4, max: 4 }),
  body("description").trim().escape(),
];

module.exports = { brandFormSanitization };
