const express = require("express");

export function mainTitle(req, res, next) {
  req.body.mainTitle = "Inventory App";
  next();
}
