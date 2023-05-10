const express = require("express");

function mainTitle(req, res, next) {
  req.body.mainTitle = "Inventory App";
  next();
}

module.exports = { mainTitle };
