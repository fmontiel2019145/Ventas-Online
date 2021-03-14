"use strict";

var cartController = require("../Controllers/CarritosController");
var express = require("express");
var md_autentication = require("../Middlewares/authentication");

var app = express.Router();

app.post("/agregarAlCarrito", md_autentication.ensureAuth, cartController.agregarAlCarrito);

module.exports = app;
