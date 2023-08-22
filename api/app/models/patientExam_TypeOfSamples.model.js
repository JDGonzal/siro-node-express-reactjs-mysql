module.exports = (sequelize, Sequelize) => {
  const patientExam_TypeOfSamples = sequelize.define('patientexam_typeofsamples');

  return patientExam_TypeOfSamples;
};
