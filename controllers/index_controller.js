const Drink = require("../models/drink");
const Brand = require("../models/brand");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//display summary
exports.summary = asyncHandler(async (req, res, next) => {
  //get details of counts of drinks and brands
  const [
    drinkCount,
    brandCount,
    drinkInstanceCount,
    drinksAvailableCount,
    drinksSoldCount,
  ] = await Promise.all([
    Drink.countDocuments({}).exec(),
    Brand.countDocuments({}).exec(),
    DrinkInstance.countDocuments({}).exec(),
    DrinkInstance.countDocuments({ status: "Available" }).exec(),
    DrinkInstance.countDocuments({ status: "Sold" }).exec(),
  ]);

  res.render("index", {
    title: "Inventory",
    drink_count: drinkCount,
    brand_count: brandCount,
    drinks_instance_count: drinkInstanceCount,
    drinks_available_count: drinksAvailableCount,
    drinks_sold_count: drinksSoldCount,
  });
});
