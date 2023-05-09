const express = require("express");
const { body } = require("express-validator");
const { DateTime } = require("luxon");

export function setInstanceStatus(req, res, next) {
  if (Date.now() >= body.date_of_expiry) {
    //expired
    body.status = "Expired";
  } else if (body.date_of_sale !== "") {
    //sold
    body.status = "Sold";
  } else {
    //not sold
    body.status = "Available";
  }
  next();
}
