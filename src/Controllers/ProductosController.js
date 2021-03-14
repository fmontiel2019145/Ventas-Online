"use strict";

const ModeloProductos = require("../Models/ProductosModel");
const ModeloCategorias = require("../Models/CategoriasModel");;

function guardarProducto(req, res){
    var dataSesion = req.usuario;

    var nombre = req.body.nombreProducto;
    var precio = req.body.precioProducto;
    var stock = req.body.cantidadProducto;
    var marca = req.body.marcaProducto;
    var categoria = req.body.categoriaProducto;

    var productoModel = new ModeloProductos({
        nombreProducto : nombre,
        precioProducto : precio,
        stockProducto : stock,
        marcaProducto : marca,
        categoriaProducto : categoria
    });
    if(dataSesion.rolUsuario == "ADMIN"){
        ModeloCategorias.find({_id : categoria}).exec((err, categoria) => {
            if(err){
                res.status(500).send({mensaje : "Categoria para integrar al producto no existe", err});
            }else{
                if(categoria && categoria.length > 0){
                    ModeloProductos.findOne({nombreProducto : nombre}).exec((err, producto) => {
                        if(err){
                            res.status(500).send({mensaje : "Error en la consulta al verificar Producto", err});
                        }else{
                            if(producto){
                                res.status(200).send("Ese producto ya existe");
                            }else{
                                productoModel.save((err, productoGuardado) => {
                                    if(err){
                                        res.status(500).send({mensaje : "Error en la consulta al verificar Producto", err});
                                    }else{
                                        res.status(200).send(productoGuardado);
                                    }
                                });
                            }
                        }
                    });
                }else{
                    res.status(200).send("No existe la categoria");
                }
            }
        });
    }else{
        res.status(200).send("No eres administrador");
    }
}

function listarProductos(req, res) {
    ModeloProductos.find({}, (err, productos) => {
        ModeloProductos.populate(productos, { path: "categoriaProducto" }, (err, productos) => {
            if(err){
                res.status(200).send({mensaje : "Algo falló ", err});
            }else{
                if(productos && productos.length > 0){
                    res.status(200).send({ productos });
                }else{
                    res.status(404).send("No se encontraron productos");
                }
            }
        });
    });
}

function listarProductosPorNombre(req, res) {
    var nombre = req.body.nombreProducto;

    ModeloProductos.find({nombreProducto : nombre}, (err, productos) => {
        ModeloProductos.populate(productos, { path: "categoriaProducto" }, (err, productos) => {
            if(err){
                res.status(200).send({mensaje : "Algo falló ", err});
            }else{
                if(productos && productos.length > 0){
                    res.status(200).send({ productos });
                }else{
                    res.status(404).send("No se encontraron productos");
                }
            }
        });
    });
}

function editarProducto(req, res){
    var dataSesion = req.usuario;
    var idProducto = req.params.id;
    var newData = req.body;

    if (dataSesion.rolUsuario == "ADMIN") {
        ModeloProductos.findOneAndUpdate({_id : idProducto}, newData, {new: true}, (err, productoActualizado) => {
            if(err){
                res.status(500).send("Erro al actualizar el producto");
            }else{
                if(productoActualizado){
                    res.status(200).send(productoActualizado);
                }else{
                    res.status(404).send("No existe ese producto");
                }
            }
        });
    } else {
        res.status(200).send({message: "No eres administrador"});
    }
}

function verExistencia(req, res) {
    var nombre = req.body.nombreProducto;

    ModeloProductos.findOne({nombreProducto : nombre}).exec((err, producto) => {
        if(err){
            res.status(500).send("Error al buscar producto");
        }else{
            if(producto){
                res.status(200).send(producto);
            }else{
                res.status(404).send("Producto no encontrado");
            }
        }
    });
}

function borrarProducto(req, res) {
    var id = req.params.id;

    var dataSesion = req.usuario;

    if (dataSesion.rolUsuario == "ADMIN") {
        ModeloProductos.findOneAndDelete({_id : id}, (err, productoBorrado) => {
            if(err){
                res.status(500).send("Error al borrar producto");
            }else{
                if(productoBorrado){
                    res.status(200).send(productoBorrado);
                }else{
                    res.status(404).send("Producto no encontrado");
                }
            }
        });
    }else{
        res.status(200).send({message: "No eres Administrador"});
    }
}

function verProductosPorCategoria(req, res) {
    var nombreCategoria = req.body.nombreCategoria;

    ModeloCategorias.findOne({nombreCategoria: nombreCategoria}).exec((err, categoria) => {
        if(err){
            res.status(500).send("Error al encontrar producto");
        }else{
            if(categoria){
                ModeloProductos.find({categoriaProducto : categoria._id}).exec((err, productos) => {
                    if(err){
                        res.status(500).send("Error al borrar producto");
                    }else{
                        if(productos){
                            res.status(200).send(productos);
                        }else{
                            res.status(404).send("Producto no encontrado");
                        }
                    }
                });
            }else{
                res.status(404).send("Productos no encontrado");
            }
        }
    });
}

function verProductosAgotados(req, res) {
    ModeloProductos.find({
        stockProducto: 0,
    }).exec((err, productos) => {
        if(err){
            res.status(400).send("Error al buscar los agotados");
        }else{
            if(productos){
                res.status(200).send(productos);
            }else{
                res.status(404).send("No hay productos");
            }
        }
    });
}

function verProductosMasVendidos(req, res) {
    ModeloProductos.find({})
        .sort({ ventasProducto: -1 })
        .limit(10)
        .exec((err, productos) => {
            if(err){
                res.status(400).send("Error al buscar los mas vendidos");
            }else{
                if(productos){
                    res.status(200).send(productos);
                }else{
                    res.status(404).send("No hay productos");
                }
            }
        });
}

module.exports = {
    guardarProducto,
    listarProductos,
    listarProductosPorNombre,
    editarProducto,
    verExistencia,
    borrarProducto,
    verProductosPorCategoria,
    verProductosAgotados,
    verProductosMasVendidos,
};
