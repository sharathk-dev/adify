import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isPhone: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vehicles: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        cardDetails: {
            type: DataTypes.JSON,
        },
    }, {
        tableName: 'members',
        timestamps: true
    });

    Member.associate = (models) => {
        // One-to-Many with Transaction
        Member.hasMany(models.Transaction, {
            foreignKey: 'memberId',
            as: 'transactions'
        });

        // One-to-Many with AdClick
        Member.hasMany(models.AdClick, {
            foreignKey: 'memberId',
            as: 'adClicks'
        });
    };

    return Member;
};