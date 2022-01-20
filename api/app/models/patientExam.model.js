module.exports = (sequelize, Sequelize) => {
  const PatientExam = sequelize.define('PatientExams', {
    patientExamId: {
      type: Sequelize.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
    },
    patientExamOthers: {
      type: Sequelize.STRING,
    },
    patientExamRemarks: {
      type: Sequelize.STRING,
    },
    patientExamAddress: { 
      type: Sequelize.STRING,
      allowNull: false,
    },
    patientExamTelNumber: { 
      type: Sequelize.BIGINT,
      allowNull: false,
    },
  });

  return PatientExam;
};
