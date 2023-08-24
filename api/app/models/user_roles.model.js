module.exports = (sequelize, Sequelize) => {
  const user_roles = sequelize.define('user_roles');

  return user_roles;
};
