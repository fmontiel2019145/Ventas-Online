"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_password_RQ";

exports.createToken = function (usuario) {
    var payload = {
        idUsuario: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correoUsuario: usuario.correoUsuario,
        apodoUsuario: usuario.apodoUsuario,
        rolUsuario: usuario.rolUsuario,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix(),
    };

    return jwt.encode(payload, secret);
};
