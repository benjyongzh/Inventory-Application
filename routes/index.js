var express = require("express");
var router = express.Router();

//controllers
const index_controller = require("../controllers/index_controller");
const drink_controller = require("../controllers/drink_controller");
const drink_instance_controller = require("../controllers/drink_instance_controller");
const brand_controller = require("../controllers/brand_controller");

/* GET home page. */
router.get("/", index_controller.summary);

//=============== DRINKS =========================

//GET all drinks
router.get("/drinks", drink_controller.all_drinks);
// //GET one drink
router.get("/drink/:id", drink_controller.drink_detail);

//GET create drink form
router.get("/drink/create", drink_controller.drink_create_get);
//POST create drink form
router.post("/drink/create", drink_controller.drink_create_post);

// //GET update drink form
// router.get("/drink/:id/update", drink_controller.drink_update_get);
// //POST update drink form
// router.post("/drink/:id/update", drink_controller.drink_update_post);

// //GET delete drink form
// router.get("/drink/:id/delete", drink_controller.drink_delete_get);
// //POST delete drink form
// router.post("/drink/:id/delete", drink_controller.drink_delete_post);

//=============== BRANDS =========================

//GET all brands
router.get("/brands", brand_controller.all_brands);
//GET one brand
router.get("/brand/:id", brand_controller.brand_detail);

//GET create brand form
router.get("/brand/create", brand_controller.brand_create_get);
//POST create brand form
router.post("/brand/create", brand_controller.brand_create_post);

// //GET update brand form
// router.get("/brand/:id/update", brand_controller.brand_update_get);
// //POST update brand form
// router.post("/brand/:id/update", brand_controller.brand_update_post);

// //GET delete brand form
// router.get("/brand/:id/delete", brand_controller.brand_delete_get);
// //POST delete brand form
// router.post("/brand/:id/delete", brand_controller.brand_delete_post);

//=============== DRINK INSTANCES =========================

//GET all drink_instances
router.get("/drinkinstances", drink_instance_controller.all_drink_instances);
//GET one drink
router.get(
  "/drinkinstance/:id",
  drink_instance_controller.drink_instance_detail
);

//GET create drink_instance form
router.get(
  "/drinkinstance/create",
  drink_instance_controller.drink_instance_create_get
);
//POST create drink_instance form
router.post(
  "/drinkinstance/create",
  drink_instance_controller.drink_instance_create_post
);

// //GET update drink_instance form
// router.get(
//   "/drinkinstance/:id/update",
//   drink_instance_controller.drink_instance_update_get
// );
// //POST update drink_instance form
// router.post(
//   "/drinkinstance/:id/update",
//   drink_instance_controller.drink_instance_update_post
// );

// //GET delete drink_instance form
// router.get(
//   "/drinkinstance/:id/delete",
//   drink_instance_controller.drink_instance_delete_get
// );
// //POST delete drink_instance form
// router.post(
//   "/drinkinstance/:id/delete",
//   drink_instance_controller.drink_instance_delete_post
// );

module.exports = router;
