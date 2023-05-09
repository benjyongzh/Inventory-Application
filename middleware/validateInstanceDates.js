const asyncHandler = require("express-async-handler");
const express = require("express");
const { body } = require("express-validator");
const { DateTime } = require("luxon");

export function validateInstanceDates(req, res, next) {
  body("date_of_manufacture")
    .exists()
    .withMessage("Manufacture Date must not be empty")
    .isISO8601()
    .toDate(),
    body("date_of_expiry")
      .exists()
      .withMessage("Expiry Date must not be empty")
      .isISO8601()
      .toDate()
      .custom((expiry, { req }) => {
        if (expiry.getTime() < req.body.date_of_manufacture.getTime()) {
          throw new Error("Date of Manufacture must be before Date of Expiry");
        }
        return true;
      }),
    body("date_of_sale")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .custom((sale, { req }) => {
        if (sale.getTime() < req.body.date_of_manufacture.getTime()) {
          throw new Error("Date of Manufacture must be before Date of Sale");
        }
        return true;
      })
      .custom((sale, { req }) => {
        if (sale.getTime() > req.body.date_of_expiry.getTime()) {
          throw new Error("Date of Sale must be before Date of Expiry");
        }
        return true;
      }),
    next();
}
