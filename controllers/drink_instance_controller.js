const Drink = require("../models/drink");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//display list of all instances
exports.all_drink_instances = asyncHandler(async (req, res, next) => {
  const alldrinkinstances = await DrinkInstance.find({}, "drink")
    .sort({ _id: 1 })
    .populate("drink")
    .exec();

  const config = req.app.get("config");

  res.render("all_drink_instances", {
    mainTitle: config.mainTitle,
    title: "All Drink Instances",
    instances: alldrinkinstances,
  });
});

//GET specific instance page
exports.drink_instance_detail = asyncHandler(async (req, res, next) => {
  //get specific object based on :id
  const [drinkinstance, drink] = await Promise.all([
    DrinkInstance.findById(req.params.id).exec(),
    Drink.find({ drink: req.params.id }),
  ]);

  if (drinkinstance === null) {
    // no such brand
    const err = new Error("Instance not found");
    err.status = 404;
    return next(err);
  }

  const config = req.app.get("config");

  res.render("drink_instance_detail", {
    mainTitle: config.mainTitle,
    instance: drinkinstance,
    drink: drink,
  });
});

//GET form for creating drink_instances
exports.drink_instance_create_get = asyncHandler(async (req, res, next) => {
  const config = req.app.get("config");

  res.render("drink_instance_form", {
    mainTitle: config.mainTitle,
    title: "Create a Drink Instance",
  });
});

//POST form for creating an instance
exports.drink_instance_create_post = [
  //validation and sanitization of fields
  body("drink", "Drink must not be empty")
    .exists()
    .withMessage("Drink must be specified.")
    .trim()
    .escape(),
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

  asyncHandler(async (req, res, next) => {
    //create Brand object with sanitized data
    const drink_instance = new DrinkInstance({
      drink: req.body.drink,
      date_of_manufacture: req.body.date_of_manufacture,
      date_of_expiry: req.body.date_of_expiry,
      date_of_sale: req.body.date_of_sale,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      const config = req.app.get("config");

      //render form again
      res.render("drink_instance_form", {
        mainTitle: config.mainTitle,
        title: "Create a Drink Instance",
      });
    } else {
      //data in form is valid. save drink object into db
      await drink_instance.save();
      res.redirect("/drinkinstances");
    }
  }),
];
