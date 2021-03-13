"use strict";

var express = require("express");
var productController = require("../Controllers/ProductosController");
var md_autentication = require("../Middlewares/authentication");

var app = express.Router();

app.post("/guardarProducto", md_autentication.ensureAuthAdmin, productController.saveProduct);
app.get("/listarProductos", md_autentication.ensureAuthAdmin, productController.listProducts);
app.get("/listarProductosPorNombre", md_autentication.ensureAuthAdmin, productController.listProductsByName);
/*
app.get("/listProduct", productController.listProduct);
*/
app.put("/editarProducto/:idProduct", md_autentication.ensureAuthAdmin, productController.editProduct);
app.get("/verExistencia", md_autentication.ensureAuthAdmin, productController.viewStocks);
app.delete("/eliminarProducto/:idProduct", md_autentication.ensureAuthAdmin, productController.deleteProduct);
app.get("/buscarPorCategoria", productController.viewProductsForCategorys);
app.get("/verProductosAgotados", md_autentication.ensureAuthAdmin, productController.viewDownProducts);
app.get("/verProductosMasVendidos", md_autentication.ensureAuthAdmin, productController.viewProductsMostSelled);

module.exports = app;
