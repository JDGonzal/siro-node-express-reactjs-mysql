module.exports = (sequelize, Sequelize) => {
  const PatientExam = sequelize.define('PatientExams', {
    patientExamId: {
      type: Sequelize.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
    },
    patientExamRemarks: { /*OBSERVACIONES (Datos clínicos relevantes. Especificaciones para las pruebas solicitadas. 
      Urgencias. Antibióticos de preferencia para el antibiograma, entre otros)*/
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
