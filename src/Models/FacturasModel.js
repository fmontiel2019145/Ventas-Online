"use strict";

const mongoose = require("mongoose");
var Schemma = mongoose.Schema;

var billSchema = Schemma({
    date: Date,
    total: Number,
    user: [
        {
            type: Schemma.Types.ObjectId,
            ref: "user",
            required: true,
        },
    ],
    products: [
        {
            product: Schemma.Types.ObjectId,
            name: String,
            quantity: Number,
            price: Number,
            subtotal: Number,
        },
    ],
});

module.exports = mongoose.model("Facturas", billSchema);
