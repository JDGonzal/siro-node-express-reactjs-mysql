module.exports = (sequelize, Sequelize) => {
  const patientExam_LaboratoryTests = sequelize.define('patientexam_laboratorytests');

  return patientExam_LaboratoryTests;
};
