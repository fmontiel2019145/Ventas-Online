"use strict";

var FacturasModel = require("../Models/FacturasModel");
var CarritosModel = require("../Models/CarritosModel");
var ProductosModel = require("../Models/ProductosModel");
var UsuariosModel = require("../Models/UsuariosModel");

function crearFactura(req, res){
    var dataSesion = req.usuario;
    var idUsuario = req.params.id;

    var modeloFacturas = new FacturasModel();
    
    if(dataSesion.rolUsuario == "ADMIN" || idUsuario == dataSesion.idUsuario){
        CarritosModel.findOne({usuarioCarrito : idUsuario}).exec((err, carrito) => {
            if(err){
                res.status(500).send("Error en la consulta para obtener el carrito")
            }else{
                if(carrito){
                    modeloFacturas.usuarioFactura = idUsuario;
                    modeloFacturas.fechaFactura = new Date();
                    modeloFacturas.productosFactura = carrito.productosCarrito;
                    modeloFacturas.totalFactura = carrito.totalCarrito;
                    
                    CarritosModel.findOneAndUpdate({_id : carrito._id}, {productosCarrito : [], totalCarrito : 0}, {new : true}, (err, carritoActualizado) => {
                        if(err){
                            res.status(500).send("Error en la consulta para borrar datos del carrito");
                        }else{
                            if(carritoActualizado){
                                modeloFacturas.save((err, facturaIngresada) => {
                                    if(err){
                                        res.status(500).send("Error en la consulta para borrar datos del carrito");
                                    }else{
                                        if(facturaIngresada){
                                            res.status(200).send({carrito: carritoActualizado, factura : facturaIngresada});
                                        }else{
                                            res.status(404).send("No se pudo agregar la factura");
                                        }
                                    }
                                });
                            }else{
                                res.status(404).send("No se pudo actualizar");
                            }
                        }
                    });
                }else{
                    res.status(404).send({mensaje : "No existe carrito"});
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador o no es tu cuenta");
    }
}

function listarFacturas(req, res) {
    var dataSesion = req.usuario;

    if(dataSesion.rolUsuario == "ADMIN"){
        FacturasModel.find({}).exec((err, facturas) => {
            if(err){
                res.status(500).send(facturas);
            }else{
                if (facturas) {
                    res.status(200).send(facturas);
                }else{
                    res.status(200).send("No hay facturas");
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador o no es tu cuenta");
    }
}

function verProductosPorFactura(req, res) {
    var dataSesion = req.usuario;
    var idFactura = req.params.id;

    FacturasModel.findById(idFactura).exec((err, factura) => {
        if (err) {
            res.status(500).send("Error en la consulta para obtener la factura");
        }else{
            if(dataSesion.rolUsuario == "ADMIN" || factura.usuarioFactura == dataSesion.idUsuario){
                if (factura) {
                    res.status(200).send(factura.productosFactura);
                }else{
                    res.status(404).send("No hay productos en esa factura");
                }
            }else{
                res.status(200).send("No eres administrador o no es tu cuenta");
            }
        }
    });
}

module.exports = {
    crearFactura,
    listarFacturas,
    verProductosPorFactura
};
