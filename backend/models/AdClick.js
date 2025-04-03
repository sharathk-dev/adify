import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js'; 



const AdClick = sequelize.define(
  'AdClick',
  {
    id: {
      type: DataTypes.BIGINT, 
      primaryKey: true,
      autoIncrement: true,
    },
    adId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'ads', key: 'id' },
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'members', key: 'id' },
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isClicked: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },
  {
    tableName: 'ad_clicks',
    timestamps: true,
    underscored: true
  }
);

// Add as static method
AdClick.getAdClick = async (transactionId) => {
  try {
    return await AdClick.findOne({ where: { id: transactionId } });
  } catch (error) {
    console.error('Error fetching ad click:', error);
    throw error;
  }
};




AdClick.insertAdClick = async (adId, memberId) => {
  try {
    if (!adId || !memberId) throw new Error('adId and memberId are required');
    return await AdClick.create({ adId, memberId, isClicked: 0 });
  } catch (error) {
    console.error('Error inserting ad click:', error);
    throw error;
  }
};


AdClick.updateAdClick = async (transactionId) => {
  try {
    return await sequelize.query(
      `UPDATE ad_clicks SET is_clicked = is_clicked + 1 WHERE id = :transactionId`,
      { replacements: { transactionId }, type: sequelize.QueryTypes.UPDATE }
    );
  } catch (error) {
    console.error('Error updating ad click:', error);
    throw error;
  }
};

export default AdClick;