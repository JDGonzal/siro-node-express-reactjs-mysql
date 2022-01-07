module.exports = (sequelize, Sequelize) => {
  const PetOwner = sequelize.define('PetOwners', {
    petOwnerId: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    petOwnerName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return PetOwner;
};
