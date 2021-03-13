"use strict";

//Imports
var Category = require("../Models/CategoriasModel");
var bcrypt = require("bcrypt-nodejs");
var Product = require("../Models/ProductosModel");

function saveCategory(req, res) {
    var categoryModel = new Category();
    var params = req.body;
    var userClient = req.userAdmin.user;

    if (req.userAdmin.rol == "ADMIN") {
        if (params.name) {
            categoryModel.name = params.name;
            Category.find({ name: categoryModel.name }).exec((err, categoryFound) => {
                if (err) return res.status(500).send({ message: "Error en la peticion" });

                if (categoryFound && categoryFound.length >= 1) {
                    return res.status(500).send({
                        message: "La categoria ya existe",
                    });
                } else {
                    categoryModel.save((err, categorySaved) => {
                        if (err)
                            return res.status(500).send({
                                message: "Error en la peticion de guardar categoria",
                            });

                        if (categorySaved) {
                            res.status(500).send({
                                categorySaved,
                            });
                        } else {
                            return res.status(200).send({ message: "No se pudo guardar la categoria" });
                        }
                    });
                }
            });
        } else {
            return res.status(200).send({ message: "Ingrese todos los parametros" });
        }
    } else {
        return res.status(200).send({ message: `${userClient} Usted no es administrador ` });
    }
}

function listCategorys(req, res) {
    Category.find().exec((err, categorys) => {
        if (err) return res.status(200).send({ message: "Error en la peticion" });

        if (!categorys) {
            return res.status(200).send({ message: "Error en la consulta de Categorias" });
        } else {
            return res.status(200).send({ categorys });
        }
    });
}

function deleteCategory(req, res) {
    var categoryId = req.params.id;
    var idDefault = "";

    if (req.userAdmin.rol == "ADMIN") {
        Category.findOne({ name: "Default Category" }).exec((err, defaultCategoryFind) => {
            if (err) return res.status(200).send({ message: "Error en el servidor" });

            if (defaultCategoryFind) {
                idDefault = defaultCategoryFind._id;
            }
        });

        Category.findById(categoryId, (err, categoryFind) => {
            if (err) {
                res.status(500).send({ message: "Error en el servidor" });
            } else if (categoryFind) {
                Product.updateMany({ category: categoryId }, { $set: { category: idDefault } }, { new: true }, (err, setDefault) => {
                    if (err) {
                        res.status(500).send({ message: "Error en el servidor" });
                    } else if (setDefault) {
                        Category.findByIdAndDelete(categoryId, (err, categoryDeleted) => {
                            if (err) {
                                res.status(500).send({ message: "Error en el servidor" });
                            } else if (categoryDeleted) {
                                res.send({
                                    message: "Categoria eliminada correctamente",
                                    categoryDeleted,
                                });
                            } else {
                                res.status(404).send({ message: "No se pudo borrar la categoria" });
                            }
                        });
                    } else {
                        res.status(404).send({
                            message: "No se pudo pasar a la categoria por defecto",
                        });
                    }
                });
            } else {
                res.status(404).send({ message: "No se pudo encontrar la categoria" });
            }
        });
    } else {
        return res.status(200).send({
            message: "Usted no administrador no puede eliminar categorias",
        });
    }
}

function editCategory(req, res) {
    var categoryId = req.params.idCategory;
    var params = req.body;

    if (params.name) {
        Category.findByIdAndUpdate(categoryId, params, { new: true }, (err, categoryUpdate) => {
            if (err) return res.status(200).send({ message: "Error en el servidor" });

            if (categoryUpdate) {
                return res.status(200).send({ categoryUpdate });
            } else {
                return res.status(200).send({ message: "No se pudo editar" });
            }
        });
    } else {
        return res.status(200).send({ message: "Error con los parametros" });
    }
}
module.exports = {
    saveCategory,
    listCategorys,
    deleteCategory,
    editCategory,
};
