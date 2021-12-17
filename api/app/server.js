const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: 'http://localhost:8081'
};
app.use(cors());

const db = require('./models');
const Role = db.role;

function initial() {
  Role.create({ roleId: 1, roleName: 'viewer' });
  Role.create({ roleId: 2, roleName: 'editor' });
  Role.create({ roleId: 3, roleName: 'admin' });
}
// the next line to call the 'initial()' method to create each role
/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});/* */
//The next line replaces the previos method, it can use every time
/*db.sequelize.sync(); /* */

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Alquimia-Software application.' });
});

// Routes
app.use(require('./routes/auth.routes.js'));
app.use(require('./routes/role.routes.js'));
app.use(require('./routes/medicalCenter.routes.js'));

// set port, listen for requests
const PORT = process.env.PORT || 49146;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
