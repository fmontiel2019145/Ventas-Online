"use strict";

var ModeloCategorias = require("../Models/CategoriasModel");
var ModeloProductos = require("../Models/ProductosModel");

function verificarCategoria(condition, callback){
    ModeloCategorias.findOne(condition).exec((err, categoria) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, categoria);
        }
    });
}

function buscarCategoria(condition, callback){
    ModeloCategorias.find(condition).exec((err, categorias) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, categorias);
        }
    });
}

function listarCategorias(req, res){
    var dataSesion = req.usuario;

    buscarCategoria({}, (err, categorias) => {
        if(err){
            res.status(500).send("Error al buscar las categorias");
        }else{
            if(categorias){
                res.status(200).send(categorias);
            }else{
                res.status(404).send("No se encontraron categorias");
            }
        }
    });
}

function guardarCategoria(req, res) {
    var dataSesion = req.usuario;
    var nombre = req.body.nombreCategoria;

    var newCategoria = new ModeloCategorias({
        nombreCategoria : nombre
    });

    if(dataSesion.rolUsuario == "ADMIN"){
        verificarCategoria({nombreCategoria : nombre}, (err, categoria) => {
            if(err){
                res.status(500).send("Error al verificar categoria");
            }else{
                if(categoria){
                    res.status(404).send("Ya existe esta categoria");
                }else{
                    newCategoria.save((err, savedCategoria) => {
                        if(err){
                            res.status(500).send("Error al guardar categoria");
                        }else{
                            res.status(200).send({newCategoria : savedCategoria});
                        }
                    });
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador");
    }
}

function eliminarCategoria(condition, callback){
    ModeloCategorias.findOneAndDelete(condition, (err, categoria) => {
        if(err){
            callback(err, null);
        }else{
            callback(false, categoria);
        }
    });
}

function borrarCategoria(req, res){
    var dataSesion = req.usuario;
    var id = req.params.id;

    if(dataSesion.rolUsuario == "ADMIN"){
        eliminarCategoria({_id: id}, (err, categoria) => {
            if(err){
                res.status(500).send("Error al eliminar la categoria");
            }else{
                if(categoria){

                    verificarCategoria({nombreCategoria : "Default"}, (err, categoriaDefault) => {
                        if(err){
                            res.status(500).send({mensaje : "Error al buscar Default ", err});
                        }else{
                            if(categoria){
                                ModeloProductos.updateMany({ categoriaProducto: categoria._id }, { categoriaProducto: categoriaDefault._id }, { new: true }, (err, newProducts) => {
                                    if(err){
                                        res.status(500).send({mensaje : "Error en la consulta al acualizar productos por la categoria eliminada", err});
                                    }else{
                                        if(newProducts){
                                            res.status(200).send({mensaje: "Se actualizaron los productos", newProducts});
                                        }else{
                                            res.status(404).send("No habia productos con esa categoria");
                                        }
                                    }
                                });
                            }else{
                                res.status(404).send("No se encontró la categoria default");
                            }
                        }
                    });
                }else{
                    res.status(404).send("No existe la categoria ingresada");
                }
            }
        });
    }else{
        res.status(200).send("No eres administraddor");
    }
}

function actualizarCategoria(req, res) {
    var dataSesion = req.usuario;
    var idCategoria = req.params.id;
    var newData = req.body;

    if(dataSesion.rolUsuario == "ADMIN"){    
        ModeloCategorias.findOneAndUpdate({_id : idCategoria}, newData, {new: true}, (err, newCategoria) => {
            if(err){
                res.status(500).send({ mensaje : "Error a obtener categorias", newCategoria});
            }else{
                if(newCategoria){
                    res.status(200).send(newCategoria);
                }else{
                    res.status(200).send("No se encontró la categoria para actualizar");
                }
            }
        });
    }else{
        res.status(200).send("No eres Administrador");
    }
}

module.exports = {
    guardarCategoria,
    listarCategorias,
    borrarCategoria,
    actualizarCategoria
};
