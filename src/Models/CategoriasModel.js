"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = Schema({
    nombreCategoria: String,
});

module.exports = mongoose.model("categorias", CategorySchema);
