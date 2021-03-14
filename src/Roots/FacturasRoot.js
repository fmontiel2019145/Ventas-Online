"use strict";

var express = require("express");
var ControladorFacturas = require("../Controllers/FacturasController");
var api = express();
var md_autentication = require("../Middlewares/authentication");

api.get("/crearFactura/:id", md_autentication.ensureAuth, ControladorFacturas.crearFactura);
api.get("/listarFacturas", md_autentication.ensureAuth, ControladorFacturas.listarFacturas);
api.get("/verProductosPorFactura/:id", md_autentication.ensureAuth, ControladorFacturas.verProductosPorFactura);

module.exports = api;
