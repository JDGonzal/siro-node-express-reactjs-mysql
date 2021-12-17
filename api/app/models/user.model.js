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
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false, 
      defaultValue: false,
    },
    token: {
      type: Sequelize.STRING,
    },
    language: {
      type: Sequelize.STRING(7),
      allowNull: false, 
      defaultValue: 'es',
    },
  });

  return User;
};
