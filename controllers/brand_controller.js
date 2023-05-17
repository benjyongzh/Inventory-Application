const Drink = require("../models/drink");
const Brand = require("../models/brand");
const DrinkInstance = require("../models/drinkinstance");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//custom middlware
const { getCountryList } = require("../middleware/countrylist");
const {
  getDrinksFromBrandId,
  setInstanceStatusCount,
} = require("../middleware/brandInstanceCount");
const { brandFormSanitization } = require("../middleware/brandFormValidation");

//display list of all brands
exports.all_brands = asyncHandler(async (req, res, next) => {
  const allbrands = await Brand.find({}, "name country year_established")
    .sort({ name: 1 })
    .exec();

  res.render("all_brands", {
    mainTitle: req.body.mainTitle,
    title: "All Brands",
    brands: allbrands,
  });
});

//GET specific brand page
exports.brand_detail = [
  getDrinksFromBrandId,
  setInstanceStatusCount,
  asyncHandler(async (req, res, next) => {
    //get specific object based on :id
    const brand = await Brand.findById(req.params.id).exec();

    if (brand === null) {
      // no such brand
      const err = new Error("Brand not found");
      err.status = 404;
      return next(err);
    }

    console.log(req.body.drink_instances_status_count);

    res.render("brand_detail", {
      mainTitle: req.body.mainTitle,
      brand: brand,
      drinks: req.body.drinks,
      statusCount: req.body.drink_instances_status_count,
    });
  }),
];

//GET form for creating brands
exports.brand_create_get = [
  getCountryList,
  asyncHandler(async (req, res, next) => {
    res.render("brand_form", {
      mainTitle: req.body.mainTitle,
      title: "Create a Brand",
      countries: req.body.countryList,
    });
  }),
];

//POST form for creating brands
exports.brand_create_post = [
  getCountryList,
  //validation and sanitization of fields
  brandFormSanitization,

  asyncHandler(async (req, res, next) => {
    //create Brand object with sanitized data
    const brand = new Brand({
      name: req.body.name,
      country: req.body.country,
      year_established: req.body.year_established,
      description: req.body.description,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      //render form again
      res.render("brand_form", {
        mainTitle: req.body.mainTitle,
        title: "Create a Brand",
        brand: brand,
        countries: req.body.countryList,
        errors: result.array(),
      });
    } else {
      //data in form is valid. save drink object into db
      await brand.save();
      res.redirect("/brands");
    }
  }),
];

//GET form for updating brands
exports.brand_update_get = [
  getCountryList,
  asyncHandler(async (req, res, next) => {
    //get current brand
    const currentBrand = await Brand.findById(req.params.id).exec();

    res.render("brand_form", {
      mainTitle: req.body.mainTitle,
      title: "Update a Brand",
      brand: currentBrand,
      countries: req.body.countryList,
    });
  }),
];

//POST form for updating brands
exports.brand_update_post = [
  getCountryList,
  //validation and sanitization of fields
  brandFormSanitization,

  asyncHandler(async (req, res, next) => {
    //create Brand object with sanitized data
    const brand = new Brand({
      name: req.body.name,
      country: req.body.country,
      year_established: req.body.year_established,
      description: req.body.description,
      _id: req.params.id,
    });

    //check for errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //there are errors. re-render form with santized data
      //render form again
      res.render("brand_form", {
        mainTitle: req.body.mainTitle,
        title: "Update a Brand",
        brand: brand,
        countries: req.body.countryList,
        errors: result.array(),
      });
    } else {
      //data in form is valid. update existing brand object into db
      await Brand.findByIdAndUpdate(req.params.id, brand, {});
      res.redirect(brand.url);
    }
  }),
];

//GET form for deleting brands
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  //get current brand
  const [currentBrand, drinks] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Drink.find({ brand: req.params.id }),
  ]);

  res.render("brand_delete", {
    mainTitle: req.body.mainTitle,
    title: "Delete a Brand",
    brand: currentBrand,
    drinks: drinks,
    drinksDeleteErrorMsg: false,
    backURL: req.headers.referer ? req.headers.referer : "/brands",
  });
});

//POST form for deleting brands
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  // check if all drinks have already been deleted
  const [currentBrand, drinks] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Drink.find({ brand: req.params.id }),
  ]);
  if (drinks.length > 0) {
    //there are still drinks
    res.render("brand_delete", {
      mainTitle: req.body.mainTitle,
      title: "Delete a Brand",
      brand: currentBrand,
      drinks: drinks,
      drinksDeleteErrorMsg: true,
      backURL: req.headers.referer ? req.headers.referer : "/brands",
    });
    return;
  } else {
    //data in form is valid. update existing brand object into db
    await Brand.findByIdAndRemove(req.params.id);
    res.redirect("/brands");
  }
});
