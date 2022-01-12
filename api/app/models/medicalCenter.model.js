module.exports = (sequelize, Sequelize) => {
  const MedicalCenter = sequelize.define('MedicalCenters', {
    medicalCenterId: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    medicalCenterName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    medicalCenterAddress: { 
      type: Sequelize.STRING,
      allowNull: false,
    },

    medicalCenterTelNumber: { 
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  });

  return MedicalCenter;
};
