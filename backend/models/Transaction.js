import sequelize from "../db";
import { DataTypes, ENUM, STRING } from 'sequelize';

export default (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        locationId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'locations',
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
        vehicleNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entryTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        exitTime: {
            type: DataTypes.DATE
        },
        vehicleDetails: {
            type: DataTypes.JSON
        },
    }, {
        tableName: 'transactions',
        timestamps: true
    });

    Transaction.associate = (models) => {
        // Many to 1 with Member
        Transaction.belongsTo(models.Member, {
            foreignKey: {
                name: 'memberId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });

        // Many to 1 with Location
        Transaction.belongsTo(models.Location, {
            foreignKey: {
                name: 'locationId',
                allowNull: false
            },
            onDelete: 'RESTRICT'
        });
    };

    return Transaction;
};