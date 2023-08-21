module.exports = (sequelize, Sequelize) => {
  const user_MedicalCenters = sequelize.define('user_medicalCenters');

  return user_MedicalCenters;
};
