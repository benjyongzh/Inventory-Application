const { body } = require("express-validator");

const sanitizeDates = [
  body("date_of_manufacture")
    .exists()
    .withMessage("Manufacture Date must not be empty")
    .isISO8601()
    .withMessage("Manufacture Date must be ISO8601")
    .toDate()
    .withMessage("Manufacture Date must be formatted as a date"),
  body("date_of_expiry")
    .exists()
    .withMessage("Expiry Date must not be empty")
    .isISO8601()
    .withMessage("Expiry Date must be ISO8601")
    .toDate()
    .withMessage("Expiry Date must be formatted as a date"),
  body("date_of_sale")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("sale Date must be ISO8601")
    .toDate()
    .withMessage("sale Date must be formatted as a date"),
];

const checkDateSequences = [
  //check to make sure expiry date is after manufacture date
  body("date_of_expiry").custom((expiry_date, { req }) => {
    const manufacture_date = req.body.date_of_manufacture;
    if (expiry_date.getTime() < manufacture_date.getTime()) {
      throw new Error("Date of Manufacture must be before Date of Expiry");
    } else return true;
  }),

  body("date_of_manufacture")
    .if(body("date_of_sale").notEmpty())
    .custom((manufacture_date, { req }) => {
      //check to make sure sale date is after manufacture date
      const sale_date = req.body.date_of_sale;
      if (sale_date.getTime() < manufacture_date.getTime()) {
        throw new Error("Date of Manufacture must be before Date of Sale");
      } else return true;
    }),

  body("date_of_expiry")
    .if(body("date_of_sale").notEmpty())
    .custom((expiry_date, { req }) => {
      //check to make sure sale date is after manufacture date
      const sale_date = req.body.date_of_sale;
      if (sale_date.getTime() > expiry_date.getTime()) {
        throw new Error("Date of Sale must be before Date of Expiry");
      } else return true;
    }),
];

const validateAndSanitizeDates = [sanitizeDates, checkDateSequences];

module.exports = { validateAndSanitizeDates };
