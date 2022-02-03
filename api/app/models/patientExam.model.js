module.exports = (sequelize, Sequelize) => {
  const PatientExam = sequelize.define('PatientExams', {
    patientExamId: {
      type: Sequelize.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
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
    patientExamComment: { 
      type: Sequelize.STRING,
    },
    patientExamIsUrgency: { 
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    patientAnotherTypeOfSample: { 
      type: Sequelize.STRING,
    },
  });

  return PatientExam;
};
