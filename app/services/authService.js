
const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
var jwtDecode = require('jwt-decode');

exports.getToken = (req) => {
    let token = req.headers["x-access-token"];
    var decoded = jwtDecode(token);
    return decoded.id;
};