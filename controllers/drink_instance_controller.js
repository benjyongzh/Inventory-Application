const Drink = require("../models/drink");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//middleware
const { validateAndSanitizeDates } = require("../middleware/instanceDates");
const { setInstanceStatus } = require("../middleware/instanceStatus");

//display list of all instances
exports.all_drink_instances = asyncHandler(async (req, res, next) => {
  const alldrinkinstances = await DrinkInstance.find({}, "drink")
    .sort({ _id: 1 })
    .populate("drink")
    .exec();

  res.render("all_drink_instances", {
    mainTitle: req.body.mainTitle,
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

  res.render("drink_instance_detail", {
    mainTitle: req.body.mainTitle,
    instance: drinkinstance,
    drink: drink,
  });
});

//GET form for creating drink_instances
exports.drink_instance_create_get = asyncHandler(async (req, res, next) => {
  //get all drinks
  const all_drinks = await Drink.find().exec();

  res.render("drink_instance_form", {
    mainTitle: req.body.mainTitle,
    title: "Create a Drink Instance",
    drink_list: all_drinks,
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
  //validate to check dates if they are ordered correctly.
  validateAndSanitizeDates,
  //set status to expired if status==available && date of expiry has passed
  setInstanceStatus,

  asyncHandler(async (req, res, next) => {
    //create Brand object with sanitized data
    const drink_instance = new DrinkInstance({
      drink: req.body.drink,
      status: req.body.status,
      date_of_manufacture: req.body.date_of_manufacture,
      date_of_expiry: req.body.date_of_expiry,
      date_of_sale: req.body.date_of_sale,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      //get all drinks again
      const all_drinks = await Drink.find().exec();

      //render form again
      res.render("drink_instance_form", {
        mainTitle: req.body.mainTitle,
        title: "Create a Drink Instance",
        drink_list: all_drinks,
        selected_drink: drink_instance.drink._id,
        drinkinstance: drink_instance,
        errors: errors.array(),
      });
    } else {
      //data in form is valid. save drink object into db
      await drink_instance.save();
      res.redirect(drink_instance.drink.url);
    }
  }),
];
