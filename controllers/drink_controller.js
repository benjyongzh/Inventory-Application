const Drink = require("../models/drink");
const Brand = require("../models/brand");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//custom middleware
const { drinkFormSanitization } = require("../middleware/drinkFormValidation");

//display list of all drinks
exports.all_drinks = asyncHandler(async (req, res, next) => {
  const allDrinks = await Drink.find({}, "name brand")
    .sort({ name: 1 })
    .populate("brand")
    .exec();

  res.render("all_drinks", {
    mainTitle: req.body.mainTitle,
    title: "All Drinks",
    drinks: allDrinks,
  });
});

//GET specific drink page
exports.drink_detail = asyncHandler(async (req, res, next) => {
  //get specific object based on :id
  const [drink, drinkInstances] = await Promise.all([
    Drink.findById(req.params.id).populate("brand").exec(),
    DrinkInstance.find({ drink: req.params.id }),
  ]);

  if (drink === null) {
    // no such drinks
    const err = new Error("Drink not found");
    err.status = 404;
    return next(err);
  }

  res.render("drink_detail", {
    mainTitle: req.body.mainTitle,
    drink: drink,
    drink_instances: drinkInstances,
  });
});

//GET form for creating drinks
exports.drink_create_get = asyncHandler(async (req, res, next) => {
  //get all brands
  const [allBrands] = await Promise.all([Brand.find().exec()]);

  res.render("drink_form", {
    mainTitle: req.body.mainTitle,
    title: "Create a Drink",
    brands: allBrands,
    backURL: req.header.referer || "/drinks",
  });
});

//POST form for creating drinks
exports.drink_create_post = [
  //validation and sanitization of fields
  drinkFormSanitization,

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

      //render form again
      res.render("drink_form", {
        mainTitle: req.body.mainTitle,
        title: "Create a Drink",
        brands: allBrands,
        drink: drink,
        backURL: req.header.referer || "/drinks",
        errors: result.array(),
      });
    } else {
      //data in form is valid. save drink object into db
      await drink.save();
      res.redirect("/drinks");
    }
  }),
];

//GET form for updating drinks
exports.drink_update_get = asyncHandler(async (req, res, next) => {
  //get all brands
  const [currentDrink, allBrands] = await Promise.all([
    Drink.findById(req.params.id),
    Brand.find().exec(),
  ]);

  res.render("drink_form", {
    mainTitle: req.body.mainTitle,
    title: "Update a Drink",
    drink: currentDrink,
    brands: allBrands,
  });
});

//POST form for updating drinks
exports.drink_update_post = [
  //validation and sanitization of fields
  drinkFormSanitization,

  asyncHandler(async (req, res, next) => {
    //create Drink object with sanitized data
    const drink = new Drink({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      _id: req.params.id,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      //get all brands again
      const [allBrands] = await Promise.all([Brand.find().exec()]);

      //render form again
      res.render("drink_form", {
        mainTitle: req.body.mainTitle,
        title: "Update a Drink",
        brands: allBrands,
        drink: drink,
        errors: result.array(),
      });
    } else {
      //data in form is valid. save drink object into db
      await Drink.findByIdAndUpdate(req.params.id, drink, {});
      res.redirect(drink.url);
    }
  }),
];

//GET form for deleting drinks
exports.drink_delete_get = asyncHandler(async (req, res, next) => {
  //get all instances
  const [currentDrink, allInstances] = await Promise.all([
    Drink.findById(req.params.id).exec(),
    DrinkInstance.find().exec(),
  ]);

  res.render("drink_delete", {
    mainTitle: req.body.mainTitle,
    title: `Delete ${currentDrink.name}`,
    drink: currentDrink,
    instances: allInstances,
    instanceDeleteErrorMsg: false,
    backURL: req.header.referer ? req.header.referer : currentDrink.url,
  });
});

//POST form for deleting drinks
exports.drink_delete_post = asyncHandler(async (req, res, next) => {
  //get all instances
  const [currentDrink, allInstances] = await Promise.all([
    Drink.findById(req.params.id).exec(),
    DrinkInstance.find().exec(),
  ]);

  //check if there are really no more instances left for this drink
  if (allInstances.length > 0) {
    //there are still instances
    res.render("drink_delete", {
      mainTitle: req.body.mainTitle,
      title: `Delete ${currentDrink.name}`,
      drink: currentDrink,
      instances: allInstances,
      instanceDeleteErrorMsg: true,
      backURL: req.header.referer ? req.header.referer : currentDrink.url,
    });
    return;
  } else {
    //no instances left. proceed with deletion of this drink
    await Drink.findByIdAndRemove(req.params.id);
    res.redirect("/drinks");
  }
});
