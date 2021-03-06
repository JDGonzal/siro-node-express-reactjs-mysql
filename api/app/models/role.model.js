module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Roles', {
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
