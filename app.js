"use strict";

//Variables Globals
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Import Routes
var user_routes = require("./src/Roots/UsuariosRoot");
var category_routes = require("./src/Roots/CategoriasRoot");
var product_routes = require("./src/Roots/ProductosRoot");
var cart_routes = require("./src/Roots/CarritosRoot");
var bill_routes = require("./src/Roots/FacturasRoot");
//Middlewares
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//Route Application localhost:3000/api/
app.use(
  "/api",
  user_routes,
  category_routes,
  product_routes,
  cart_routes,
  bill_routes
);

//Exports
module.exports = app;
