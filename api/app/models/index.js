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

db.state.hasMany(db.city);
db.city.belongsTo(db.state);

db.state.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.state);

db.city.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.city);

db.ROLES = ['viewer', 'editor', 'admin'];

module.exports = db