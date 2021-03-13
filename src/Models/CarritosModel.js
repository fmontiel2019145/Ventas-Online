"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: "users" },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "products" },
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    total: { type: Number, default: 0 },
});

module.exports = mongoose.model("Carritos", cartSchema);
