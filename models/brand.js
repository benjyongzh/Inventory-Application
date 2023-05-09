const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  year_established: { type: Date },
  description: { type: String, default: "" },
});

//virtual for URL
BrandSchema.virtual("url").get(function () {
  return "/catalog/brand/${this._id}";
});

//virtual for formatted dates
BrandSchema.virtual("year_established_formatted").get(function () {
  return this.year_established
    ? DateTime.fromJSDate(this.year_established).toLocaleString(
        DateTime.DATE_FULL
      )
    : "";
});

module.exports = mongoose.model("Brand", BrandSchema);
