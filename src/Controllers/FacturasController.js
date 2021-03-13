"use strict";

var Bill = require("../Models/FacturasModel");
var Cart = require("../Models/CarritosModel");
var Product = require("../Models/ProductosModel");
var User = require("../Models/UsuariosModel");

function createBill(req, res) {
    var idUser = req.params.id;
    var billModel = new Bill();
    var userModel = new User();
    var Bills = [];

    Cart.findOne({ user: idUser }).exec((err, cartFind) => {
        if (err) return res.status(200).send({ message: "Error en el servidor 1" });

        if (cartFind) {
            if (cartFind.products.length == 0) {
                return res.status(200).send({ message: "No hay productos agregados en el carrito" });
            } else {
                billModel.user = idUser;
                billModel.date = new Date();
                billModel.products = cartFind.products;
                billModel.total = cartFind.total;

                billModel.save((err, billSaved) => {
                    if (err) return res.status(200).send({ message: "Error en el servidor 2" });

                    if (billSaved) {
                        cartFind.products.forEach((productoCarrito) => {
                            Product.findOne({ _id: productoCarrito.product }).exec((err, dataProduct) => {
                                if (err) {
                                } else {
                                    var newStock = parseInt(dataProduct.amount) - parseInt(productoCarrito.quantity);
                                    var newSale = parseInt(productoCarrito.quantity) + parseInt(dataProduct.sales);

                                    var newSchema = { amount: newStock, sales: newSale };

                                    Product.findByIdAndUpdate(
                                        productoCarrito.product,
                                        newSchema,
                                        {
                                            new: true,
                                            useFindAndModify: false,
                                        },
                                        (err, productoActualizado) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                if (productoActualizado) {
                                                    console.log("Producto Actualizado");
                                                } else {
                                                    console.log("Error");
                                                }
                                            }
                                        }
                                    );
                                }
                            });
                        });
                        User.findByIdAndUpdate(
                            idUser,
                            {
                                $push: {
                                    purchases: {
                                        idBill: billSaved._id,
                                        products: cartFind.products,
                                        total: cartFind.total,
                                    },
                                },
                            },
                            { new: true },
                            (err, purchasedSaved) => {
                                if (err) {
                                    console.log(idUser);
                                    return res.status(200).send({ message: "Error en el servidor 3" });
                                }
                                if (purchasedSaved) {
                                    Cart.findByIdAndUpdate(cartFind._id, { $set: { products: [], total: 0 } }, { new: true }, (err, cleanCart) => {
                                        if (err) return res.status(200).send({ message: "Error en el servidor" });

                                        if (cleanCart) {
                                            return res.status(200).send({
                                                message: "Factura creada con exito",
                                                purchasedSaved,
                                            });
                                        } else {
                                            return res.status(200).send({ message: "No se pudo limpiar el carrito" });
                                        }
                                    });
                                } else {
                                    return res.status(200).send({
                                        message: "No se pudo guardar la compra en el usario",
                                    });
                                }
                            }
                        );
                    } else {
                        return res.status(200).send({ message: "No se pudo guardar la factura" });
                    }
                });
            }
        } else {
            return res.status(200).send({ message: "No se encotro el usuario" });
        }
    });
}

function listarBills(req, res) {
    if (req.userAdmin.rol == "ADMIN") {
        Bill.find({}).exec((err, data) => {
            if (data) {
                res.status(200).send(data);
            }
        });
    }
}

function viewProductsByBill(req, res) {
    var billId = req.params.id;

    if (req.userAdmin.rol == "ADMIN") {
        Bill.findById(billId).exec((err, data) => {
            if (err) {
                console.log(err);
            }

            if (data) {
                res.status(200).send(data.products);
            }else{
                res.status(200).send("No hay productos en esa factura");
            }
        });
    }
}

module.exports = {
    createBill,
    listarBills,
    viewProductsByBill,
};
