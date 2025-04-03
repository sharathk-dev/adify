import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

  const Ad = sequelize.define('Ad', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    advertiserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'advertisers',
        key: 'id'
      }
    },
    adUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    locationIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
      validate: {
        isValidLocationArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('locationIds must be an array');
          }
          if (value.length === 0) {
            throw new Error('locationIds cannot be empty');
          }
        }
      }
    },
    costToClick: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'adCategories',
        key: 'id'
      }
    }
  }, {
    tableName: 'ads',
    timestamps: true
  });

  Ad.associate = (models) => {
    // Many-to-One with Advertiser
    Ad.belongsTo(models.Advertiser, {
      foreignKey: {
        name: 'advertiserId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    // Many-to-One with Category
    Ad.belongsTo(models.AdCategory, {
      foreignKey: {
        name: 'categoryId',
        allowNull: false
      },
      onDelete: 'RESTRICT'
    });

    // One-to-Many with AdClick
    Ad.hasMany(models.AdClick, {
      foreignKey: 'adId',
      as: 'clicks'
    });
  };

  Ad.findAllAds = async () => {
    const ads = await Ad.findAll();
    return ads;
  };

  Ad.findByPk = async (id) => {
    const ad = await Ad.findByPk(id);
    return ad;
  };

  export default Ad;