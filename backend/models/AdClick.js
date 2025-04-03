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

async function insertAdClick(adId, memberId, isClicked = false) {
  try {
      // Validate input
      if (!adId || !memberId) {
          throw new Error("adId and memberId are required");
      }

      // Insert record into the ad_clicks table
      const newClick = await AdClick.create({
          adId,
          memberId,
          isClicked,
          timestamp: new Date(), // Store the current timestamp
      });

      console.log("Ad Click recorded successfully:", newClick);
      return newClick;
  } catch (error) {
      console.error("Error inserting ad click:", error);
      throw error; // Re-throw error for handling at a higher level
  }
}

export { insertAdClick };
