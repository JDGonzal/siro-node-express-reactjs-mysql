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
    username:dbConfig.USER,
    password:dbConfig.PASSWORD,
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

db.user = require('../models/user.model.js')(sequelize, Sequelize);
db.role = require('../models/role.model.js')(sequelize, Sequelize);
db.medicalCenter = require('../models/medicalCenter.model.js')(sequelize, Sequelize);
db.state = require('../models/state.model.js')(sequelize,Sequelize);
db.city = require('../models/city.model.js')(sequelize,Sequelize);
db.patientPet = require('../models/patientPet.model.js')(sequelize,Sequelize);
db.petOwner = require('../models/petOwner.model.js')(sequelize,Sequelize);
db.species = require('./species.model.js')(sequelize,Sequelize);
db.breed = require('../models/breed.model.js')(sequelize,Sequelize);
db.patientExam = require('../models/patientExam.model.js')(sequelize,Sequelize);
db.laboratoryTest = require('../models/laboratoryTest.model.js')(sequelize, Sequelize);
db.typeOfSample = require('./typeOfSample.model.js')(sequelize, Sequelize);
db.veterinarian = require('../models/veterinarian.model.js')(sequelize, Sequelize);
db.testType = require('../models/testType.model.js')(sequelize, Sequelize);

/*============== user_roles =============== */
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

/*=========== user_medicalCenters ============ */
db.medicalCenter.belongsToMany(db.user, {
  through: 'user_medicalCenters',
  foreignKey: 'medicalCenterId',
  otherKey: 'userId'
});

db.user.belongsToMany(db.medicalCenter, {
  through: 'user_medicalCenters',
  foreignKey: 'userId',
  otherKey: 'medicalCenterId'
});

/*======== PatientExam_TypeOfSamples ========= */
db.patientExam.belongsToMany(db.typeOfSample, {
  through: 'PatientExam_TypeOfSamples',
  foreignKey: 'patientExamId',
  otherKey: 'typeOfSampleId'
});

db.typeOfSample.belongsToMany(db.patientExam, {
  through: 'PatientExam_TypeOfSamples',
  foreignKey: 'typeOfSampleId',
  otherKey: 'patientExamId'
});

/*======== PatientExam_LaboratoryTests ========= */
db.patientExam.belongsToMany(db.laboratoryTest, {
  through: 'PatientExam_LaboratoryTests',
  foreignKey: 'patientExamId',
  otherKey: 'laboratoryTestId'
});

db.laboratoryTest.belongsToMany(db.patientExam, {
  through: 'PatientExam_LaboratoryTests',
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

module.exports = db