export default (sequelize, DataTypes) => {
  const Advertiser = sequelize.define('Advertiser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    advertiserName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'advertisers',
    timestamps: true
  });

  Advertiser.associate = (models) => {
    // One-to-Many with Ad
    Advertiser.hasMany(models.Ad, {
      foreignKey: 'advertiserId',
      as: 'ads'
    });
  };

  return Advertiser;
};