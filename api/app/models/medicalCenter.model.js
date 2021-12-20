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
    medicalCenterAddress: { 
      type: Sequelize.STRING,
    },

    medicalCenterTelNumber: { 
      type: Sequelize.BIGINT,
    },
    medicalCenterAddress: { 
      type: Sequelize.STRING,
    },
  });

  return MedicalCenter;
};
