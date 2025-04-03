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
      type: DataTypes.INT,
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

async function getAdClick(transactionId){
  try{
    if(!transactionId){
      throw new Error("TransactionId are required")
    }

     await AdClick.findOne({ where: { transactionId } }) ? true : false

  }catch{

  }
}

async function updateAdClick(transactionId) {
  try {
    if (!transactionId) {
      throw new Error("TransactionId is required");
    }

    await sequelize.query(
      `UPDATE ad_clicks SET is_clicked = is_clicked + 1 WHERE id = :transactionId`,
      {
        replacements: { transactionId },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    console.log(`Ad click count updated for transaction ID: ${transactionId}`);
  } catch (error) {
    console.error("Error updating ad click:", error);
  }
}


export { insertAdClick,getAdClick };
