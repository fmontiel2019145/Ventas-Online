"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductsSchema = {
    nombreProducto: String,
    precioProducto: Number,
    stockProducto: Number,
    marcaProducto: String,
    categoriaProducto: { type: Schema.Types.ObjectId, ref: "categorias" },
    ventasProducto: { type: Number, default: 0 },
};

module.exports = mongoose.model("productos", ProductsSchema);
