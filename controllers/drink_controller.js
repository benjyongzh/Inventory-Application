const Drink = require("../models/drink");
const Brand = require("../models/brand");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//display list of all drinks
exports.all_drinks = asyncHandler(async (req, res, next) => {
  const allDrinks = await Drink.find({}, "name brand")
    .sort({ title: 1 })
    .populate("brand")
    .exec();
  res.render("all_drinks", { title: "All Drinks", drinks: allDrinks });
});
