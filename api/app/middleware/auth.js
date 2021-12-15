// It validates the token
const jwt = require("jsonwebtoken");
require("dotenv").config(); // import config = require('config');

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. No token provided"
    });

    try {
        const decoded = jwt.verify(token, process.env.AUTH_SEED);
        req.user = decoded; //{ id: 7, roles: [ 'viewer' ], iat: 1635632856, exp: 1635636456 }
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Token expired"
        });
    }

    next();
}
