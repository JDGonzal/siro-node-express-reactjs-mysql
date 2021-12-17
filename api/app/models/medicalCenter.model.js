module.exports = (sequelize, Sequelize) => {
  const MedicalCenter = sequelize.define('MedicalCenters', {
    medicalCenterId: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    medicalCenterName: {
      type: Sequelize.STRING,
      allowNull: false
    },
  });

  return MedicalCenter;
};
