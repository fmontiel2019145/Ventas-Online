"use strict";

var express = require("express");
var billController = require("../Controllers/FacturasController");
var api = express();
var md_autentication = require("../Middlewares/authentication");

api.get("/crearFactura/:id", billController.createBill);
api.get("/listarFacturas", md_autentication.ensureAuthAdmin, billController.listarBills);
api.get("/verProductosPorFactura/:id", md_autentication.ensureAuthAdmin, billController.viewProductsByBill);

module.exports = api;
