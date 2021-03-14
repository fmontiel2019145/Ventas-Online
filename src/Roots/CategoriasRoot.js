"use strict";

var express = require("express");
var ControladorCategorias = require("../Controllers/CategoriasController");

var md_autentication = require("../Middlewares/authentication");

var api = express.Router();
api.post("/guardarCategoria", md_autentication.ensureAuth, ControladorCategorias.guardarCategoria);
api.get("/listarCategorias", md_autentication.ensureAuth, ControladorCategorias.listarCategorias);
api.put("/editarCategoria/:id", md_autentication.ensureAuth, ControladorCategorias.actualizarCategoria);
api.delete("/eliminarCategoria/:id", md_autentication.ensureAuth, ControladorCategorias.borrarCategoria);

module.exports = api;
