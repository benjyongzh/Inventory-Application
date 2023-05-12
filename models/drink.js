const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DrinkSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  description: { type: String, default: "" },
});

//virtual for URL
DrinkSchema.virtual("url").get(function () {
  return `/drink/${this._id}`;
});

module.exports = mongoose.model("Drink", DrinkSchema);
