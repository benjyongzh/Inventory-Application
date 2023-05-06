const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
  year_established: { type: Date },
  description: { type: String },
});

//virtual for URL
BrandSchema.virtual("url").get(function () {
  return "/catalog/brand/${this._id}";
});

module.exports = mongoose.model("Brand", BrandSchema);
