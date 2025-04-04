import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../db.js'; 
import Member from './Member.js';
import Ad from './Ad.js';



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
    timestamps: true,
    underscored: false,
    tableName: 'adClicks'
  }
);


AdClick.belongsTo(Ad, { foreignKey: 'adId' }); // Defaults to Ad.id
AdClick.belongsTo(Member, { foreignKey: 'memberId' }); // Defaults to Member.id


// Add as static method
AdClick.getAdClick = async (transactionId) => {
  try {
    return await AdClick.findOne({ where: { id: transactionId } });
  } catch (error) {
    console.error('Error fetching ad click:', error);
    throw error;
  }
};




AdClick.insertAdClick = async (adId, memberId, isClicked = 0) => {
  try {
    if (!adId || !memberId) throw new Error('adId and memberId are required');
    return await AdClick.create({ adId, memberId, isClicked });
  } catch (error) {
    console.error('Error inserting ad click:', error);
    throw error;
  }
};


AdClick.updateAdClick = async (transactionId) => {
  try {
    const adClick = await AdClick.findByPk(transactionId);
    if (adClick) {
      adClick.isClicked = adClick.isClicked + 1;
      return await adClick.save();
    }
    return null;
  } catch (error) {
    console.error('Error updating ad click:', error);
    throw error;
  }
};

export default AdClick;