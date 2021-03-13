"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
    nombreUsuario: String,
    apodoUsuario: String,
    correoUsuario: String,
    claveUsuario: String,
    rolUsuario: { type: String, default: "CLIENT" },
    comprasUsuario: [
        {
            factura: { type: Schema.Types.ObjectId, ref: "bill" },
            productos: [],
            total: Number,
        },
    ],
});

module.exports = mongoose.model("Usuarios", userSchema);
