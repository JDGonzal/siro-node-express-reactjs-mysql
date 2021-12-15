module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('roles', {
    roleId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    roleName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Role;
};
