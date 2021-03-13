"use strict";

//Imports
var express = require("express");
var categoryController = require("../Controllers/CategoriasController");

//Middlewares
var md_autentication = require("../Middlewares/authentication");

//Routes
var api = express.Router();
api.post("/guardarCategoria", md_autentication.ensureAuthAdmin, categoryController.saveCategory);

api.get("/listarCategorias", md_autentication.ensureAuthAdmin, categoryController.listCategorys);

api.delete("/eliminarCategoria/:id", md_autentication.ensureAuthAdmin, categoryController.deleteCategory);

api.put("/editarCategoria/:idCategory", md_autentication.ensureAuthAdmin, categoryController.editCategory);
//Exports
module.exports = api;
