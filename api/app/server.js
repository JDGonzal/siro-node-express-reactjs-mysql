const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
  origin: 'http://localhost:8081'
};
app.use(cors());

const init_All = require('./data');
const { laboratoryTest } = require('./models');

// the next line to call the 'initial()' method to create each role
//  init_All();

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
app.use(require('./routes/state.routes.js'));
app.use(require('./routes/city.routes.js'));
app.use(require('./routes/patientPet.routes.js'));
app.use(require('./routes/species.routes.js'));
app.use(require('./routes/breed.routes.js'));
app.use(require('./routes/petOwner.routes.js'));
app.use(require('./routes/sqlQuery.routes.js'));
app.use(require('./routes/patientExam.routes.js'));
app.use(require('./routes/veterinarians.routes.js'));
app.use(require('./routes/typeOfSample.routes.js'));
app.use(require('./routes/testType.routes.js'));
app.use(require('./routes/laboratoryTest.routes.js'));
app.use(require('./routes/patientexam_laboratorytest.routes.js'));
app.use(require('./routes/patientexam_typeofsample.routes.js'));

// set port, listen for requests
const PORT = process.env.PORT || 49146;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
