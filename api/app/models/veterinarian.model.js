module.exports = (sequelize, Sequelize) => {
  const Veterinarian = sequelize.define('Veterinarians', {
    veterinarianId: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    veterinarianName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Veterinarian;
};
