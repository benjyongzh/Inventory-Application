const express = require("express");
const { body } = require("express-validator");
const { DateTime } = require("luxon");

function setInstanceStatus(req, res, next) {
  if (Date.now() >= req.body.date_of_expiry) {
    //expired
    req.body.status = "Expired";
  } else if (body.date_of_sale instanceof Date) {
    //sold
    req.body.status = "Sold";
  } else {
    //not sold
    req.body.status = "Available";
  }
  next();
}

module.exports = { setInstanceStatus };
