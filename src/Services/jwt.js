"use strict";

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "secret_password_RQ";

exports.createTokenAdmin = function (userAdmin) {
  var payload = {
    sub: userAdmin._id,
    name: userAdmin.name,
    email: userAdmin.email,
    user: userAdmin.user,
    password: userAdmin.password,
    rol: userAdmin.rol,
    iat: moment().unix(),
    exp: moment().day(10, "days").unix(),
  };
  return jwt.encode(payload, secret);
};

exports.createTokenClient = function (userClient) {
  var payload = {
    sub: userClient._id,
    name: userClient.name,
    email: userClient.email,
    user: userClient.user,
    password: userClient.password,
    rol: userClient.rol,
    iat: moment().unix(),
    exp: moment().day(10, "days").unix(),
  };
  return jwt.encode(payload, secret);
};
