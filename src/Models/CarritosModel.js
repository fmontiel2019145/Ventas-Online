"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = Schema({
    usuarioCarrito: { type: Schema.Types.ObjectId, ref: "usuarios" },
    productosCarrito: [
        {
            idProducto: { type: Schema.Types.ObjectId, ref: "productos" },
            nombreProducto: String,
            precioProducto: Number,
            cantidadProducto: Number,
        },
    ],
    totalCarrito: { type: Number, default: 0 },
});

module.exports = mongoose.model("Carritos", cartSchema);
