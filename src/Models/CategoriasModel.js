"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = Schema({
    name: String,
});

module.exports = mongoose.model("Categorias", CategorySchema);
