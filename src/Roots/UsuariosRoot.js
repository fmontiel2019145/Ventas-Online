"use strict";

//Imports
var express = require("express");
var ControladorUsuarios = require("../Controllers/UsuariosController");

//Importation of Middlewares

var md_authentication = require("../Middlewares/authentication");

//Routes
var api = express.Router();
api.post("/registrarUsuario", ControladorUsuarios.guardarUsuario);
api.post("/login", ControladorUsuarios.login);
api.put("/ascenderCliente", md_authentication.ensureAuth, ControladorUsuarios.ascenderUsuario);
api.put("/editarUsuario/:idUsuario", md_authentication.ensureAuth, ControladorUsuarios.actualizarUsuario);
api.delete("/eliminarUsuario/:idUsuario", md_authentication.ensureAuth, ControladorUsuarios.borrarUsuario);

//Exports
module.exports = api;
