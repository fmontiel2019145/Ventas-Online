"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductsSchema = {
    name: String,
    price: Number,
    amount: Number,
    mark: String,
    category: { type: Schema.Types.ObjectId, ref: "categorys" },
    sales: { type: Number, default: 0 },
};

module.exports = mongoose.model("Productos", ProductsSchema);
