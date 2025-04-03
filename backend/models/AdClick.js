export default (sequelize, DataTypes) => {
  const AdClick = sequelize.define('AdClick', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    adId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ads',
        key: 'id'
      }
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isClicked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'ad_clicks',
    timestamps: true
  });

  AdClick.associate = (models) => {
    // Many-to-One with Ad
    AdClick.belongsTo(models.Ad, {
      foreignKey: {
        name: 'adId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    // Many-to-One with Member
    AdClick.belongsTo(models.Member, {
      foreignKey: {
        name: 'memberId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return AdClick;
}; 