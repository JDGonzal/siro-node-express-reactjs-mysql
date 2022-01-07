module.exports = (sequelize, Sequelize) => {
  const Breed = sequelize.define('Breeds', {
    breedId: {
      type: Sequelize.INTEGER,
      primaryKey: true, 
      allowNull: false
    },
    breedName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return Breed;
};
