const Drink = require("../models/drink");
const Brand = require("../models/brand");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//display list of all brands
exports.all_brands = asyncHandler(async (req, res, next) => {
  const allbrands = await Brand.find({}, "name country year_established")
    .sort({ name: 1 })
    .exec();

  const config = req.app.get("config");

  res.render("all_brands", {
    mainTitle: config.mainTitle,
    title: "All Brands",
    brands: allbrands,
  });
});

//GET specific brand page
exports.brand_detail = asyncHandler(async (req, res, next) => {
  //get specific object based on :id
  const [brand, drinks] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Drink.find({ brand: req.params.id }),
  ]);

  if (brand === null) {
    // no such brand
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  const config = req.app.get("config");

  res.render("brand_detail", {
    mainTitle: config.mainTitle,
    brand: brand,
    drinks: drinks,
  });
});

//GET form for creating brands
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  const config = req.app.get("config");

  res.render("brand_form", {
    mainTitle: config.mainTitle,
    title: "Create a Brand",
  });
});

//POST form for creating brands
exports.brand_create_post = [
  //validation and sanitization of fields
  body("name", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Brand name must be at least 1 character long")
    .escape()
    .withMessage("Brand name must be specified.")
    .isAlphanumeric()
    .withMessage("Brand name has non-alphanumeric characters."),
  body("country", "Country must not be empty")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country name must be at least 1 character long")
    .escape()
    .withMessage("Country must be specified.")
    .isAlphanumeric()
    .withMessage("Country name has non-alphanumeric characters."),
  body("year_established", "Country must not be empty")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("description").trim().escape(),

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
      const config = req.app.get("config");

      //render form again
      res.render("brand_form", {
        mainTitle: config.mainTitle,
        title: "Create a Brand",
      });
    } else {
      //data in form is valid. save drink object into db
      await brand.save();
      res.redirect("/brands");
    }
  }),
];
