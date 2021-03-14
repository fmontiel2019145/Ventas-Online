"use strict";

var express = require("express");
var productController = require("../Controllers/ProductosController");
var md_autentication = require("../Middlewares/authentication");

var app = express.Router();

app.post("/guardarProducto", md_autentication.ensureAuth, productController.guardarProducto);
app.get("/listarProductos", md_autentication.ensureAuth, productController.listarProductos);
app.get("/listarProductosPorNombre", md_autentication.ensureAuth, productController.listarProductosPorNombre);
app.put("/editarProducto/:id", md_autentication.ensureAuth, productController.editarProducto);
app.get("/verExistencia", md_autentication.ensureAuth, productController.verExistencia);
app.delete("/eliminarProducto/:id", md_autentication.ensureAuth, productController.borrarProducto);
app.get("/buscarPorCategoria", productController.verProductosPorCategoria);
app.get("/verProductosAgotados", md_autentication.ensureAuth, productController.verProductosAgotados);
app.get("/verProductosMasVendidos", md_autentication.ensureAuth, productController.verProductosMasVendidos);

module.exports = app;
