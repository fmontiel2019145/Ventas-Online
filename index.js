// IMPORTS
const mongoose = require("mongoose");
const app = require("./app");
const User = require("./src/Models/UsuariosModel");
const Category = require("./src/Models/CategoriasModel");
const bcrypt = require("bcrypt-nodejs");
const { model } = require("./src/Models/UsuariosModel");

mongoose.Promise = global.Promise;
mongoose
    .connect("mongodb://localhost:27017/dbOnlineStore", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Se encuentra conectado a la base de datos");

        app.listen(3000, function () {
            console.log("Servidor corriendo en el puerto 3000");
        });
        defaultUser();
        defaultCategory();
    })
    .catch((err) => console.log(err));

function defaultUser(req, res) {
    User.findOne({
        apodoUsuario: "ADMIN",
    }).exec((err, userData) => {
        if (userData) {
            console.log("Usuario por defecto ya creado");
        } else {
            var userModel = new User({
                nombreUsuario: "ADMIN",
                apodoUsuario: "ADMIN",
                correoUsuario: "ADMIN@localhost.com",
                claveUsuario: bcrypt.hashSync("123456"),
                rolUsuario: "ADMIN",
            });
            userModel.save();
            console.log("Usuario ADMIN creado con exito");
        }
    });
}

function defaultCategory(req, res) {
    Category.findOne({
        nombreCategoria: "Default",
    }).exec((err, categoryFind) => {
        if (categoryFind) {
            console.log("Categoria por defecto ya creada");
        } else {
            var categoryModel = new Category({
                nombreCategoria: "Default",
            });
            categoryModel.save();
            console.log("Categoria por defecto creada con exito");
        }
    });
}
