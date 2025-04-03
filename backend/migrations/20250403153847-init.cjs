'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('advertisers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      advertiserName: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('members', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      contact: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      vehicles: { type: Sequelize.JSON, allowNull: false },
      cardDetails: { type: Sequelize.JSON },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('locations', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      lat: { type: Sequelize.FLOAT },
      long: { type: Sequelize.FLOAT },
      address: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('ads', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      advertiserId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'advertisers', key: 'id' }, onDelete: 'CASCADE' },
      adUrl: { type: Sequelize.STRING, allowNull: false },
      imageUrl: { type: Sequelize.STRING },
      locationIds: { type: Sequelize.JSON, allowNull: false },
      costToClick: { type: Sequelize.FLOAT, allowNull: false },
      categoryId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'categories', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('ad_clicks', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      adId: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'ads', key: 'id' }, onDelete: 'CASCADE' },
      memberId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'members', key: 'id' }, onDelete: 'CASCADE' },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      isClicked: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('transactions', {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      locationId: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'locations', key: 'id' }, onDelete: 'CASCADE' },
      memberId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'members', key: 'id' }, onDelete: 'CASCADE' },
      vehicleNumber: { type: Sequelize.STRING, allowNull: false },
      entryTime: { type: Sequelize.DATE, allowNull: false },
      exitTime: { type: Sequelize.DATE },
      vehicleDetails: { type: Sequelize.JSON },
      total: { type: Sequelize.FLOAT, defaultValue: 0 },
      discount: { type: Sequelize.FLOAT, defaultValue: 0 },
      serviceFee: { type: Sequelize.FLOAT, defaultValue: 0 },
      paid: { type: Sequelize.FLOAT, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('ad_clicks');
    await queryInterface.dropTable('ads');
    await queryInterface.dropTable('locations');
    await queryInterface.dropTable('members');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('advertisers');
  }
};
