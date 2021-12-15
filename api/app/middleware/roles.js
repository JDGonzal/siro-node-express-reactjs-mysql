// it Exports each role to use to validate a transaction
function admin(req, res, next) {
  if (!req.user.roles.includes("admin")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });

  next();
}

function editor(req, res, next) {
  if (!req.user.roles.includes("editor")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });

  next();
}

function viewer(req, res, next) {
  console.log('user:\n',req.user, '\nroles:\n', req.user.roles);
  if (!req.user.roles.includes("viewer")) return res.status(403).send({
      ok: false,
      error: "Access denied."
  });
  
  next();
}

module.exports = { admin, editor, viewer };
