"user strict";
var ModeloCarritos = require("../Models/CarritosModel");
var ModeloProductos = require("../Models/ProductosModel");

function agregarAlCarrito(req, res){
    var dataSesion = req.usuario;

    var nombreProducto = req.body.nombreProducto;
    var cantidadProducto = req.body.cantidadProducto;

    if(dataSesion.rolUsuario == "CLIENT"){
        ModeloCarritos.findOne({usuarioCarrito : dataSesion.idUsuario}).exec((err, carrito) => {
            if(err){
                res.status(500).send(err);
            }else{
                if(carrito){
                    ModeloProductos.findOne({nombreProducto : nombreProducto}, (err, producto) => {
                        if(err){
                            res.status(200).send({mensaje : "Algo falló ", err});
                        }else{
                            if(producto){
                                ModeloCarritos.findByIdAndUpdate(
                                    carrito._id,
                                    {
                                        $push: {
                                            productosCarrito: {
                                                idProducto: producto._id,
                                                nombreProducto: producto.nombreProducto,
                                                precioProducto: producto.precioProducto,
                                                cantidadProducto: cantidadProducto
                                            }
                                        }
                                    },
                                    { new: true },
                                    (err, carritoNew) => {
                                        if(err){
                                            res.status(500).send(err);
                                        }else{
                                            if(carrito){
                                                var sumaTotal = 0;

                                                carritoNew.productosCarrito.forEach(producto => {
                                                    sumaTotal += producto.cantidadProducto * producto.precioProducto;
                                                });

                                                ModeloCarritos.findByIdAndUpdate(
                                                    carrito._id,
                                                    {totalCarrito : sumaTotal}, 
                                                    {new : true},
                                                    (err, carritoActualizado) => {
                                                        if(err){
                                                            res.status(500).send("Error en la consulta para actualizar total del carrito");
                                                        }else{
                                                            if(carritoActualizado){
                                                                res.status(200).send(carritoActualizado);
                                                            }else{
                                                                res.status(404).send("No se actualizó");
                                                            }
                                                        }
                                                    }
                                                );
                                                
                                            }else{
                                                res.status(404).send("No se encontró el carrito");
                                            }
                                        }
                                    }
                                );
                            }else{
                                res.status(404).send("No se encontraron productos");
                            }
                        }
                    });
                }else{
                    res.status(404).send("No se encontró el carrito");
                }
            }
        });
    }else{
        res.status(200).send("No eres cliente");
    }
}

function agregarAlCarritos(req, res) {
    var idUser = req.userClient.sub;
    var params = req.body;

    if (req.userClient.rol == "CLIENT") {
        if (params.name && params.quantity) {
            Cart.findOne({ user: idUser }).exec((err, cartFind) => {
                if (err) return res.status(200).send({ message: "Error en el servidor" });
                if (cartFind) {
                    cartId = cartFind._id;
                    Product.findOne({ name: params.name }).exec((err, productFind) => {
                        if (err) return res.status(200).send({ message: "Error en el servidor" });
                        if (productFind) {
                            if (productFind.quantity == 0) {
                                return res.status(200).send({
                                    message: "No hay articulos disponibles en este momento",
                                });
                            } else {
                                Cart.findByIdAndUpdate(
                                    cartId,
                                    {
                                        $push: {
                                            products: {
                                                product: productFind._id,
                                                name: params.name,
                                                quantity: params.quantity,
                                                price: productFind.price,
                                            },
                                        },
                                    },
                                    { new: true },
                                    (err, productAdd) => {
                                        if (err) return res.status(200).send({ message: "Error en el servidor" });

                                        if (productAdd) {
                                            var totalCart = parseInt(cartFind.total) + parseInt(productFind.price) * parseInt(params.quantity);

                                            Cart.findByIdAndUpdate(cartId, { $set: { total: totalCart } }, { new: true }, (err, finalTotal) => {
                                                if (err) return res.status(200).send({ message: "Error en el servidor" });

                                                if (finalTotal) {
                                                    return res.status(200).send({
                                                        message: "Producto agregado al carrito correctamente",
                                                        Total: finalTotal.total,
                                                    });
                                                } else {
                                                    return res.status(200).send({ message: "No se pudo agregar el total" });
                                                }
                                            });
                                        } else {
                                            return res.status(200).send({
                                                message: "No se pudo agregar el producto al carrito",
                                            });
                                        }
                                    }
                                );
                            }
                        } else {
                            return res.status(200).send({ message: "No se encontro el producto" });
                        }
                    });
                } else {
                    return res.status(200).send({ message: "Error de login" });
                }
            });
        } else {
            return res.status(200).send({ message: "Ingrese todos los paramentros" });
        }
    } else {
        return res.status(200).send({
            message: "Usted es administrador y no puede agregar productos al carrito",
        });
    }
}

module.exports = {
    agregarAlCarrito,
};
