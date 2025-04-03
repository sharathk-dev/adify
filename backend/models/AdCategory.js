import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const AdCategory = sequelize.define('AdCategory', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'adCategories',
    timestamps: true
  });

  AdCategory.associate = (models) => {
    // One-to-Many with Ad
    AdCategory.hasMany(models.Ad, {
      foreignKey: 'categoryId',
      as: 'ads'
    });
  };

export default AdCategory;