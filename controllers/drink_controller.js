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

  const config = req.app.get("config");

  res.render("all_drinks", {
    mainTitle: config.mainTitle,
    title: "All Drinks",
    drinks: allDrinks,
  });
});

//GET form for creating drinks
exports.drink_create_get = asyncHandler(async (req, res, next) => {
  //get all brands
  const [allBrands] = await Promise.all([Brand.find().exec()]);

  const config = req.app.get("config");

  res.render("drink_form", {
    mainTitle: config.mainTitle,
    title: "Create a Drink",
    brands: allBrands,
  });
});

//POST form for creating drinks
exports.drink_create_post = [
  //validation and sanitization of fields
  body("name", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("brand", "Brand must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description").trim().escape(),

  asyncHandler(async (req, res, next) => {
    //create Drink object with sanitized data
    const drink = new Drink({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      //get all brands again
      const [allBrands] = await Promise.all([Brand.find().exec()]);

      const config = req.app.get("config");

      //render form again
      res.render("drink_form", {
        mainTitle: config.mainTitle,
        title: "Create a Drink",
        brands: allBrands,
        errors: errors.array(),
      });
    } else {
      //data in form is valid. save drink object into db
      await drink.save();
      res.redirect("/drinks");
    }
  }),
];
