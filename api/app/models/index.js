const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.log = require('../models/log.model.js')(sequelize, Sequelize);
db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.role = require('../models/role.model.js')(sequelize, Sequelize);
db.medicalCenter = require('../models/medicalCenter.model.js')(sequelize, Sequelize);
db.state = require('../models/state.model.js')(sequelize, Sequelize);
db.city = require('../models/city.model.js')(sequelize, Sequelize);
db.patientPet = require('../models/patientPet.model.js')(sequelize, Sequelize);
db.petOwner = require('../models/petOwner.model.js')(sequelize, Sequelize);
db.species = require('./species.model.js')(sequelize, Sequelize);
db.breed = require('../models/breed.model.js')(sequelize, Sequelize);
db.patientExam = require('../models/patientExam.model.js')(sequelize, Sequelize);
db.laboratoryTest = require('../models/laboratoryTest.model.js')(sequelize, Sequelize);
db.typeOfSample = require('./typeOfSample.model.js')(sequelize, Sequelize);
db.veterinarian = require('../models/veterinarian.model.js')(sequelize, Sequelize);
db.testType = require('../models/testType.model.js')(sequelize, Sequelize);

/*============== user_roles =============== */
db.user_roles = require('./user_Roles.model.js')(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId'
});

db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId'
});

/*=========== user_medicalcenters ============ */
db.user_medicalcenters = require('./user_medicalcenters.model.js')(sequelize, Sequelize);
db.medicalCenter.belongsToMany(db.user, {
  through: 'user_medicalcenters',
  foreignKey: 'medicalCenterId',
  otherKey: 'userId'
});

db.user.belongsToMany(db.medicalCenter, {
  through: 'user_medicalcenters',
  foreignKey: 'userId',
  otherKey: 'medicalCenterId'
});
/*======== patientexam_typeofsamples ========= */
db.patientexam_typeofsamples = require('./patientexam_typeofsamples.model.js')(sequelize, Sequelize);
db.patientExam.belongsToMany(db.typeOfSample, {
  through: 'patientexam_typeofsamples',
  foreignKey: 'patientExamId',
  otherKey: 'typeOfSampleId'
});

db.typeOfSample.belongsToMany(db.patientExam, {
  through: 'patientexam_typeofsamples',
  foreignKey: 'typeOfSampleId',
  otherKey: 'patientExamId'
});

/*======== patientexam_laboratorytests ========= */
db.patientexam_laboratorytests = require('./patientexam_laboratorytests.model.js')(sequelize, Sequelize);
db.patientExam.belongsToMany(db.laboratoryTest, {
  through: 'patientexam_laboratorytests',
  foreignKey: 'patientExamId',
  otherKey: 'laboratoryTestId'
});

db.laboratoryTest.belongsToMany(db.patientExam, {
  through: 'patientexam_laboratorytests',
  foreignKey: 'laboratoryTestId',
  otherKey: 'patientExamId'
});

db.state.hasMany(db.city);
db.city.belongsTo(db.state);

db.state.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.state);

db.city.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.city);

db.species.hasMany(db.patientPet);
db.patientPet.belongsTo(db.species);

db.species.hasMany(db.breed);
db.breed.belongsTo(db.species);

db.petOwner.hasMany(db.patientPet);
db.patientPet.belongsTo(db.petOwner);

db.species.hasMany(db.patientPet);
db.patientPet.belongsTo(db.species);

db.breed.hasMany(db.patientPet);
db.patientPet.belongsTo(db.breed);

db.medicalCenter.hasMany(db.patientPet);
db.patientPet.belongsTo(db.medicalCenter);

db.veterinarian.hasMany(db.patientExam);
db.patientExam.belongsTo(db.veterinarian);

db.patientPet.hasMany(db.patientExam);
db.patientExam.belongsTo(db.patientPet);

db.testType.hasMany(db.laboratoryTest);
db.laboratoryTest.belongsTo(db.testType);

db.ROLES = ['viewer', 'clinic', 'laboratory', 'admin'];

module.exports = db;
