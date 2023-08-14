// it Exports each role to use to validate a transaction
const setLog = require('../utils/logs.utils')
function admin(req, res, next) {
  setLog("DEBUG",__filename,arguments.callee.name,'req.user.roles.includes("admin")');
  if (!req.user.roles.includes("admin")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });

  next();
}

function laboratory(req, res, next) {
  setLog("DEBUG",__filename,arguments.callee.name,'req.user.roles.includes("laboratory")');
  if (!req.user.roles.includes("laboratory")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });

  next();
}

function clinic(req, res, next) {
  setLog("DEBUG",__filename,arguments.callee.name,'req.user.roles.includes("clinic")');
  if (!req.user.roles.includes("clinic")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });

  next();
}

function viewer(req, res, next) {
  setLog("DEBUG",__filename,arguments.callee.name,'req.user.roles.includes("viewer")');
  if (!req.user.roles.includes("viewer")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });
  
  next();
}

module.exports = { admin, laboratory, clinic, viewer };
