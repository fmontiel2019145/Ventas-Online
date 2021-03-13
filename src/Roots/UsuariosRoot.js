"use strict";

//Imports
var express = require("express");
var userController = require("../Controllers/UsuariosController");

//Importation of Middlewares

var md_authentication = require("../Middlewares/authentication");

//Routes
var api = express.Router();
api.post("/registrarUsuario", userController.saveUser);
api.post("/login", userController.login);
api.put("/ascenderCliente", md_authentication.ensureAuthAdmin, userController.ascenderClient);
api.put("/editarUsuario/:idCliente", md_authentication.ensureAuthAdmin, userController.editarUsuario);
api.put("/editarMiCuenta/:idCliente", md_authentication.ensureAuthClient, userController.editarMiCuenta);
api.delete("/eliminarUsuario/:idCliente", md_authentication.ensureAuthAdmin, userController.eliminarUsuario);
api.delete("/eliminarMiCuenta/:idCliente", md_authentication.ensureAuthClient, userController.eliminarMiCuenta);

//Exports
module.exports = api;
