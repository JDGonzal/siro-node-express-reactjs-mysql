// It validates the token
const jwt = require("jsonwebtoken");
require("dotenv").config(); // import config = require('config');
const setLog = require("../utils/logs.utils.js");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    const funcName = arguments.callee.name + "auth.js";
    const apiUrl = "(req, res, next)|";
    var error = "";
    if (!token) {
        error = "Access denied. No token provided";
        setLog("ERROR", __filename, funcName, `${apiUrl}.error:${error}`);
        return res.status(401).send({
            ok: false,
            error: error,
        })
    };

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SEED);
        error = "Token expired";
        setLog("DEBUG", __filename, funcName, `${apiUrl}.decoded:${JSON.stringify(decoded)}`);
        req.user = decoded; //{ id: 7, roles: [ 'viewer' ], iat: 1635632856, exp: 1635636456 }
        setLog("info", __filename, funcName, `${apiUrl}.req.user:${JSON.stringify(req.user)}`);
    } catch (err) {
        console.log(__filename, funcName, 'error:', err);
        setLog("ERROR", __filename, funcName, `${apiUrl}.error:${error} - ${JSON.stringify(err)}`);
        return res.status(401).send({
            ok: false,
            error: `${error} - ${JSON.stringify(err)}`
        });
    }

    next();
}
