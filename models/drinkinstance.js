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

///virtual for formatted dates
DrinkInstanceSchema.virtual("date_of_manufacture_formatted").get(function () {
  return this.date_of_manufacture
    ? DateTime.fromJSDate(this.date_of_manufacture).toLocaleString(
        DateTime.DATE_FULL
      )
    : "";
});

DrinkInstanceSchema.virtual("date_of_expiry_formatted").get(function () {
  return this.date_of_expiry
    ? DateTime.fromJSDate(this.date_of_expiry).toLocaleString(
        DateTime.DATE_FULL
      )
    : "";
});

DrinkInstanceSchema.virtual("date_of_sale_formatted").get(function () {
  return this.date_of_sale
    ? DateTime.fromJSDate(this.date_of_sale).toLocaleString(DateTime.DATE_FULL)
    : "";
});

module.exports = mongoose.model("DrinkInstance", DrinkInstanceSchema);
