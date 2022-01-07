module.exports = (sequelize, Sequelize) => {
  const PatientPet = sequelize.define('PatientPets', {
    patientPetId: {
      type: Sequelize.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
    },
    patientPetName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    patientPetBirthday: { 
      type: Sequelize.DATE,
      allowNull: false,
    },
    patientPetGender: { 
      type: Sequelize.STRING(1),
      allowNull: false, 
      defaultValue: 'M',
    },
    patientPetHeight: { 
      type: Sequelize.INTEGER,
    },
    patientPetWeight: { 
      type: Sequelize.INTEGER,
    },
  });

  return PatientPet;
};
