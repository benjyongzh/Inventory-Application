const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const DrinkInstanceSchema = new Schema({
  drink: { type: Schema.Types.ObjectId, ref: "Drink", required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Expired", "Sold"],
  },
  date_of_manufacture: { type: Date, required: true, default: Date.now },
  date_of_expiry: { type: Date, required: true },
  date_of_sale: { type: Date },
});

//virtual for URL
DrinkInstanceSchema.virtual("url").get(function () {
  return "/catalog/drinkinstance/${this._id}";
});

//virtual for time left til expiry - find out if luxon has a duration method
// DrinkInstanceSchema.virtual("time_left").get(function () {
//   return "/catalog/drinkinstance/${this._id}";
// });

module.exports = mongoose.model("DrinkInstance", DrinkInstanceSchema);
