"use strict";
//Imports
var User = require("../Models/UsuariosModel");
var Cart = require("../Models/CarritosModel");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../Services/jwt");
const e = require("express");

function saveUser(req, res) {
    var userModel = new User();
    var cartModel = new Cart();
    var params = req.body;

    if (params.nombreUsuario && params.apodoUsuario && params.claveUsuario && params.correoUsuario) {
        userModel.nombreUsuario = params.nombreUsuario;
        userModel.apodoUsuario = params.apodoUsuario;
        userModel.correoUsuario = params.correoUsuario;
        userModel.claveUsuario = params.claveUsuario;

        User.find({
            $or: [{ nombreUsuario: userModel.nombreUsuario }, { correoUsuario: userModel.correoUsuario }],
        }).exec((err, userFound) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });

            if (userFound && userFound.length >= 1) {
                return res.status(500).send({ message: "El usuario ya existe" });
            } else {
                bcrypt.hash(params.claveUsuario, null, null, (err, encryptedPassword) => {
                    userModel.claveUsuario = encryptedPassword;

                    userModel.save((err, userSaved) => {
                        if (err) return res.status(200).send({ message: "Error al guardar usuario" });

                        if (userSaved) {
                            cartModel.apodoUsuario = userSaved._id;
                            cartModel.save((err, cartSaved) => {
                                if (err) return res.status(200).send({ message: "Error en el servidor" });

                                if (cartSaved) {
                                    res.status(200).send({
                                        userSaved,
                                        message: "Se creo su carrito listo para agregar productos",
                                    });
                                } else {
                                    return res.status(200).send({ message: "No se pudo crear el carrito" });
                                }
                            });
                        } else {
                            res.status(404).send({ mensaje: "No se ha podido registrar el usuario" });
                        }
                    });
                });
            }
        });
    } else {
        return res.status(200).send({ message: "Ingrese todos los parametros" });
    }
}

function login(req, res) {
    var params = req.body;
    User.findOne(
        {
            apodoUsuario: params.apodoUsuario,
        },
        (err, userFound) => {
            if (err) return res.status(200).send({ message: "Error en la peticion" });

            if (userFound) {
                bcrypt.compare(params.claveUsuario, userFound.claveUsuario, (err, passVerified) => {
                    if (passVerified) {
                        if (userFound.rolUsuario == "ADMIN") {
                            if (params.getToken === "true") {
                                console.log("Token de aministrador creado");
                                return res.status(200).send({
                                    token: jwt.createTokenAdmin(userFound),
                                });
                            } else {
                                userFound.claveUsuario = undefined;
                                return res.status(200).send({
                                    userFound,
                                });
                            }
                        } else if (userFound.rolUsuario == "CLIENT") {
                            if (params.getToken === "true") {
                                console.log("Token de Cliente creado");

                                var arrayPurchases = [];
                                userFound.comprasUsuario.forEach((purchasesArray) => {
                                    arrayPurchases.push(purchasesArray);
                                    console.log(purchasesArray);
                                    console.log(arrayPurchases);
                                });
                                return res.status(200).send({
                                    token: jwt.createTokenClient(userFound),
                                    arrayPurchases,
                                });
                            } else {
                                userFound.claveUsuario = undefined;
                                return res.status(200).send({
                                    userFound,
                                    arrayPurchases,
                                });
                            }
                        }
                    } else {
                        return res.status(500).send({ message: "El usuario no se a podido identificar" });
                    }
                });
            } else {
                return res.status(500).send({ message: "Error al buscar usuario" });
            }
        }
    );
}

function ascenderClient(req, res) {
    var params = req.body;

    User.findById(req.userAdmin.sub).exec((err, userLogued) => {
        if (userLogued.rolUsuario == "ADMIN") {
            User.findOne({ apodoUsuario: params.apodoUsuario }).exec((err, userFound) => {
                if (err) return res.status(200).send({ message: "Error en el servidor" });
                if (userFound) {
                    User.findByIdAndUpdate(userFound._id, { rolUsuario: "ADMIN" }, { new: true }, (err, updateUser) => {
                        if (err) return res.status(200).send({ message: "Error en el servidor" });
                        if (updateUser) {
                            return res.status(200).send({ message: "Usuario Ascendido con exito", updateUser });
                        } else {
                            return res.status(200).send({ message: "No se pudo ascencer" });
                        }
                    });
                } else {
                    return res.status(200).send({ message: "No se encontro el usuario con ese nombre" });
                }
            });
        } else {
            return res.status(200).send({ message: "Usted no es administrador para ascender clientes" });
        }
    });
}

function editarUsuario(req, res) {
    var ClientId = req.params.idCliente;
    var params = req.body;

    delete params.password;
    User.findById(req.userAdmin.sub).exec((err, userLogued) => {
        User.findOne({ _id: ClientId, rolUsuario: "CLIENT" }).exec((err, rolObtained) => {
            if (err) return res.status(200).send({ message: "Error en el servidor" });

            if (rolObtained) {
                if (userLogued.rolUsuario == "ADMIN") {
                    User.findByIdAndUpdate(rolObtained._id, params, { new: true }, (err, userUpdate) => {
                        if (err) return res.status(200).send({ message: "Error en el servidor" });

                        if (userUpdate) {
                            return res.status(200).send({ userUpdate });
                        }
                    });
                } else {
                    return res.status(200).send({
                        message: "Usted no es un administrador no puede editar otros clientes",
                    });
                }
            } else {
                return res.status(200).send({ message: "No se pudo encontrar el cliente" });
            }
        });
    });
}

function editarMiCuenta(req, res) {
    var ClientId = req.params.idCliente;
    var params = req.body;

    delete params.claveUsuario;

    User.findOne({ _id: ClientId, rolUsuario: "CLIENT" }).exec((err, rolObtained) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });
        console.log(req.userClient.sub );
        if (rolObtained) {
            if (req.userClient.sub == ClientId) {
                User.findByIdAndUpdate(rolObtained._id, params, { new: true }, (err, userUpdate) => {
                    if (err) return res.status(200).send({ message: "Error en el servidor" });

                    if (userUpdate) {
                        return res.status(200).send({ userUpdate });
                    }
                });
            } else {
                return res.status(200).send({
                    message: "No puede editar una cuenta diferente",
                });
            }
        } else {
            return res.status(200).send({ message: "No se pudo encontrar el cliente" });
        }
    });
}

function eliminarUsuario(req, res) {
    var ClientId = req.params.idCliente;

    User.findById(req.userAdmin.sub).exec((err, userLogued) => {
        User.findOne({ _id: ClientId, rolUsuario: "CLIENT" }).exec((err, rolObtained) => {
            if (err) return res.status(200).send({ message: "Error en el servidor" });
    
            if (rolObtained) {
                if (userLogued.rolUsuario == "ADMIN") {
                    User.findByIdAndDelete(rolObtained._id, (err, userDelete) => {
                        if (err) return res.status(200).send({ message: "Error en el servidor" });
    
                        if (userDelete) {
                            Cart.findOneAndDelete({ user: ClientId }, (err, cartDelete) => {
                                if (err) return res.status(200).send({ message: "Error en el servidor" });
    
                                if (cartDelete) {
                                    return res.status(200).send({ message: "No habia nada en el carrito" });
                                } else {
                                    return res.status(200).send({ message: "No se pudo eliminar el carrito  " });
                                }
                            });
                        } else {
                            return res.status(200).send({ message: "No se pudo eliminar el cliente" });
                        }
                    });
                } else {
                    return res.status(200).send({
                        message: "Usted no es un administrador no puede eliminar clientes",
                    });
                }
            } else {
                return res.status(200).send({
                    message: "No se pudo encontrar el cliente o el usuario es administrador",
                });
            }
        });
    });

}

function eliminarMiCuenta(req, res) {
    var ClientId = req.params.idCliente;

    User.findOne({ _id: ClientId, rolUsuario: "CLIENT" }).exec((err, rolObtained) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });

        if (rolObtained) {
            if (req.userClient.sub == ClientId) {
                User.findByIdAndDelete(rolObtained._id, (err, userDelete) => {
                    if (err) return res.status(200).send({ message: "Error en el servidor" });

                    if (userDelete) {
                        Cart.findOneAndDelete({ user: ClientId }, (err, cartDelete) => {
                            if (err) return res.status(200).send({ message: "Error en el servidor" });

                            if (cartDelete) {
                                return res.status(200).send({ message: "Se elimino el cliente con exito" });
                            } else {
                                return res.status(200).send({ message: "No habia nada en el carrito" });
                            }
                        });
                    } else {
                        return res.status(200).send({ message: "No se pudo eliminar el cliente" });
                    }
                });
            } else {
                return res.status(200).send({
                    message: "Usted no puede eliminar este cliente",
                });
            }
        } else {
            return res.status(200).send({
                message: "No se pudo encontrar el cliente o el usuario es administrador",
            });
        }
    });
}

//Exports
module.exports = {
    saveUser,
    login,
    ascenderClient,
    editarUsuario,
    eliminarUsuario,
    eliminarMiCuenta,
    editarMiCuenta,
};
