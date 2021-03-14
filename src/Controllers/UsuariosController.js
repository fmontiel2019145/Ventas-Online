"use strict";

var ModeloUsuarios = require("../Models/UsuariosModel");
var ModeloCarritos = require("../Models/CarritosModel");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../Services/jwt");

//No se por que lo hice XD talvés para entender mejor los callbacks
function verificarUsuario(condition, callback){
    ModeloUsuarios.findOne(condition).exec((err, usuario) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, usuario);
        }
    });
}

function crearCarrito(idUsuario, callback) {
    var carritosModelo = new ModeloCarritos({
        usuarioCarrito: idUsuario
    });

    carritosModelo.save((err, carritoUsuario) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, carritoUsuario);
        }
    });
}

function guardarUsuario(req, res) {
    var apodo = req.body.apodoUsuario;
    var nombre = req.body.nombreUsuario;
    var correo = req.body.correoUsuario;
    var clave = req.body.claveUsuario;

    var usuarioModelo = new ModeloUsuarios({
        nombreUsuario: nombre,
        apodoUsuario: apodo,
        correoUsuario: correo,
        claveUsuario: bcrypt.hashSync(clave)
    });

    verificarUsuario({$or: [{ nombreUsuario: apodo }, { correoUsuario: correo }]}, (err, usuario) => {
        if(err){
            res.status(500).send("Error al verificar usuario");
        }else{
            if(usuario){
                res.status(404).send("Ya existe el usuario");
            }else{
                usuarioModelo.save((err, usuarioGuardado) => {
                    if(err){
                        res.status(500).send("Error en la consulta al guardar el usuario");
                    }else{
                        crearCarrito(usuarioGuardado._id, (err, carrito) => {
                            if(err){
                                res.status(500).send("Error en la consulta al guardar el usuario");
                            }else{
                                res.status(200).send(usuarioGuardado);
                            }
                        });
                    }
                });
            }
        }
    }); 
}

function login(req, res) {
    var apodo = req.body.apodoUsuario;
    var clave = req.body.claveUsuario;

    verificarUsuario({apodoUsuario: apodo}, (err, usuario) => {
        if(err){
            res.status(500).send("Error en la consulta al verificar el usuario");
        }else{
            if(usuario){
                if(bcrypt.compareSync(clave, usuario.claveUsuario)){
                    res.status(200).send({token : jwt.createToken(usuario), compras: usuario.comprasUsuario});
                }else{
                    res.status(404).send("El usuario o la contraseña no es la misma");
                }
            }else{
                res.status(404).send("No se encontró el usuario");
            }
        }
    });
}

function editarUsuario(condition, newData, callback){
    ModeloUsuarios.findOneAndUpdate(condition, newData, {new: true}, (err, usuario) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, usuario);
        }
    });
}

function ascenderUsuario(req, res) {
    var dataSesion = req.usuario;
    var apodo = req.body.apodoUsuario;
    
    if(dataSesion.rolUsuario == "ADMIN"){
        editarUsuario({apodoUsuario : apodo}, {rolUsuario : "ADMIN"}, (err, usuario) => {
            if(err){
                res.status(500).send("Error en la consulta al editar el usuario");
            }else{
                if(usuario){
                    res.status(200).send({newData : usuario});
                }else{
                    res.status(404).send("No existe el usuario");
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador");
    }
}

function actualizarUsuario(req, res) {
    var dataSesion = req.usuario;
    var id = req.params.idUsuario;
    
    if(dataSesion.rolUsuario == "ADMIN" || dataSesion.idUsuario == id){
        editarUsuario({_id : id}, req.body, (err, usuario) => {
            if(err){
                res.status(500).send("Error en la consulta al editar el usuario");
            }else{
                if(usuario){
                    res.status(200).send({newData : usuario});
                }else{
                    res.status(404).send("No existe el usuario");
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador o no es tu cuenta");
    }
}

function eliminarUsuario(idUsuario, callback){
    ModeloUsuarios.findByIdAndDelete(idUsuario, (err, usuario) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, usuario);
        }
    });
}

function eliminarCarritos(condition, callback){
    ModeloCarritos.findOneAndDelete(condition, (err, carrito) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, carrito);
        }
    });
}

function borrarUsuario(req, res) {
    var dataSesion = req.usuario;
    var id = req.params.idUsuario;
    
    if(dataSesion.rolUsuario == "ADMIN" || dataSesion.idUsuario == id){
        eliminarUsuario(id, (err, usuario) => {
            if(err){
                res.status(500).send("Error en la consulta al eliminar el usuario");
            }else{
                if(usuario){
                    eliminarCarritos({usuarioCarrito : usuario._id}, (err, carritos) => {
                        if(err){
                            res.status(500).send("Error en la consulta al eliminar el usuario");
                        }else{
                            res.status(200).send({deletedUsuario : usuario, deletedCarritos : carritos});
                        }
                    });
                }else{
                    res.status(404).send("No existe el usuario");
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador o no es tu cuenta");
    }
}

module.exports = {
    guardarUsuario,
    login,
    ascenderUsuario,
    actualizarUsuario,
    borrarUsuario,
};
