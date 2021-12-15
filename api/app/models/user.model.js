module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    userId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING
    },
    medicalCenterId: {
      type: Sequelize.BIGINT,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: false,
    },
    token: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
