"use strict";

const { modelName } = require("../Models/ProductosModel");
var Product = require("../Models/ProductosModel");
var Category = require("../Models/CategoriasModel");
const { response } = require("../Roots/FacturasRoot");

function saveProduct(req, res) {
    var params = req.body;
    var productsModel = new Product();
    var userClient = req.userAdmin.user;

    if (req.userAdmin.rol == "ADMIN") {
        if (params.name && params.price && params.amount && params.category && params.amount && params.mark) {
            productsModel.name = params.name;
            productsModel.price = params.price;
            productsModel.amount = params.amount;
            productsModel.category = params.category;
            productsModel.mark = params.mark;

            Category.findById(params.category, (err, categoryFound) => {
                if (err) return res.status(200).send({ message: "Error en el id de la categoria " });

                if (categoryFound) {
                    Product.find({ name: productsModel.name }).exec((err, productFound) => {
                        if (err) return res.status(200).send({ message: "Error en la peticion" });

                        if (productFound && productFound.length >= 1) {
                            return res.status(200).send({ message: "El producto ya existe" });
                        } else {
                            productsModel.save((err, productSaved) => {
                                if (err) return res.status(200).send({ message: "Error en la peticion guardar" });

                                if (!productSaved) {
                                    return res.status(200).send({ message: "No se pudo guardar el pructo" });
                                } else {
                                    res.status(200).send({ productSaved });
                                    console.log("Se creo un producto");
                                }
                            });
                        }
                    });
                } else {
                    return res.status(200).send({ message: "No se econtro la cetegoria" });
                }
            });
        } else {
            return res.status(200).send({ message: "Ingrese todos los parametros" });
        }
    } else {
        return res.status(200).send({ message: `${userClient} Usted no es administrador ` });
    }
}

function listProducts(req, res) {
    Product.find({}, (err, products) => {
        Product.populate(products, { path: "category" }, (err, products) => {
            res.status(200).send({ products });
        });
    });
}

function listProductsByName(req, res) {
    var params = req.body;

    Product.findOne({ name: params.name }).exec((err, productFind) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });

        if (productFind) {
            return res.status(200).send({ productFind });
        }else{
            return res.status(200).send("No hay productos con ese nombre");
        }
    });
}

function editProduct(req, res) {
    var ProductId = req.params.idProduct;
    var params = req.body;

    if (req.userAdmin.rol == "ADMIN") {
        Product.findByIdAndUpdate(ProductId, params, { new: true }, (err, productUpdate) => {
            if (productUpdate) {
                return res.status(200).send({ productUpdate });
            } else {
                return res.status(200).send({ message: "No se pudo editar el producto" });
            }
        });
    } else {
        return res.status(200).send({
            message: "Usted no es administrador no puede editar este producto",
        });
    }
}

function viewStocks(req, res) {
    var params = req.body;

    Product.findOne({ name: params.name }).exec((err, productFind) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });

        if (productFind) {
            return res.status(200).send({
                Producto: productFind.name,
                Cantidad: productFind.amount,
            });
        } else {
            return res.status(200).send({ message: "No se encotro el producto" });
        }
    });
}

function deleteProduct(req, res) {
    var ProductId = req.params.idProduct;

    if (req.userAdmin.rol == "ADMIN") {
        Product.findByIdAndDelete(ProductId, (err, productDelete) => {
            if (err) return res.status(200).send({ message: "Error en el servidor" });

            if (productDelete) {
                return res.status(200).send({ message: "Producto eliminado con exito" });
            } else {
                return res.status(200).send({ message: "No se pudo borrar el producto" });
            }
        });
    } else {
        return res.status(200).send({
            message: "Usted no es administrador y no puede eliminar este producto",
        });
    }
}

function viewProductsForCategorys(req, res) {
    var params = req.body;

    Category.findOne({ name: params.category }).exec((err, categoryFind) => {
        if (err) return res.status(200).send({ message: "Error en el servidor" });

        if (categoryFind) {
            Product.find({ category: categoryFind._id }).exec((err, productsCategoryFind) => {
                if (err) return res.status(200).send({ message: "Error en el servidor" });

                if (productsCategoryFind) {
                    return res.status(200).send({ productsCategoryFind });
                } else {
                    return res.status(200).send({
                        message: "No hay productos asociados en esta categoria",
                    });
                }
            });
        } else {
            return res.status(200).send({ message: "No se encontro la categoria" });
        }
    });
}

function viewDownProducts(req, res) {
    Product.find({
        amount: 0,
    }).exec((err, productos) => {
        res.status(200).send(productos);
    });
}

function viewProductsMostSelled(req, res) {
    Product.find({})
        .sort({ sales: -1 })
        .limit(10)
        .exec((err, productos) => {
            res.status(200).send(productos);
        });
}

module.exports = {
    saveProduct,
    listProducts,
    listProductsByName,
    editProduct,
    viewStocks,
    deleteProduct,
    viewProductsForCategorys,
    viewDownProducts,
    viewProductsMostSelled,
};
