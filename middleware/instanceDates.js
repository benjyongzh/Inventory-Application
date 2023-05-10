const asyncHandler = require("express-async-handler");
const express = require("express");
const { body } = require("express-validator");
const { DateTime } = require("luxon");

const sanitizeDates = [
  body("date_of_manufacture")
    .exists()
    .withMessage("Manufacture Date must not be empty")
    .isISO8601()
    .toDate(),
  body("date_of_expiry")
    .exists()
    .withMessage("Expiry Date must not be empty")
    .isISO8601()
    .toDate(),
  body("date_of_sale").optional({ checkFalsy: true }).isISO8601().toDate(),
];

async function checkDateSequences(req, res, next) {
  if (body.date_of_expiry.getTime() < req.body.date_of_manufacture.getTime()) {
    throw new Error("Date of Manufacture must be before Date of Expiry");
  }

  if (body.date_of_sale.getTime() < req.body.date_of_manufacture.getTime()) {
    throw new Error("Date of Manufacture must be before Date of Sale");
  }

  if (body.date_of_sale.getTime() > req.body.date_of_expiry.getTime()) {
    throw new Error("Date of Sale must be before Date of Expiry");
  }

  next();
}

const validateAndSanitizeDates = [sanitizeDates, checkDateSequences];

module.exports = { validateAndSanitizeDates };
