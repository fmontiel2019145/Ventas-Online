"use strict";

const mongoose = require("mongoose");
var Schemma = mongoose.Schema;

var billSchema = Schemma({
    fechaFactura: Date,
    totalFactura: Number,
    usuarioFactura: {type: Schemma.Types.ObjectId, ref: "usuarios", required: true,},
    productosFactura: [
        {
            idProducto: Schemma.Types.ObjectId,
            nombreProducto: String,
            cantidadProducto: Number,
            precioProducto: Number
        }
    ]
});

module.exports = mongoose.model("facturas", billSchema);
