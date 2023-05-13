const Drink = require("../models/drink");
const DrinkInstance = require("../models/drinkinstance");

//set req.body.drinks drink_instance_count for brand detail page
async function getDrinksFromBrandId(req, res, next) {
  //get specific object based on :id
  const drinks = await Drink.find({ brand: req.params.id });
  req.body.drinks = drinks;
  next();
}

async function getDrinkInstanceCountPerStatus(drink) {
  const [availableCount, expiredCount, soldCount] = await Promise.all([
    DrinkInstance.countDocuments({
      drink: drink._id,
      status: "Available",
    }).exec(),
    DrinkInstance.countDocuments({
      drink: drink._id,
      status: "Expired",
    }).exec(),
    DrinkInstance.countDocuments({ drink: drink._id, status: "Sold" }).exec(),
  ]);

  return {
    availableCount: availableCount,
    expiredCount: expiredCount,
    soldCount: soldCount,
  };
}

//get drink_instance_count for brand detail page
async function setInstanceStatusCount(req, res, next) {
  req.body.drink_instances_status_count = {};

  await Promise.all(
    req.body.drinks.map(async (drink) => {
      let statusCount = await getDrinkInstanceCountPerStatus(drink);

      console.log(`bare: ${statusCount}`);

      console.log(`stringify: ${JSON.stringify(statusCount)}`);
      req.body.drink_instances_status_count[drink._id] = statusCount;
    })
  );

  next();
}

module.exports = { getDrinksFromBrandId, setInstanceStatusCount };
