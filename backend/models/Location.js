import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lat: {
            type: DataTypes.FLOAT
        },
        lng: {
            type: DataTypes.FLOAT
        },
        address: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'locations',
        timestamps: true
    });

    Location.associate = (models) => {
        // One-to-Many with Transaction
        Location.hasMany(models.Transaction, {
            foreignKey: 'locationId',
            as: 'transactions'
        });
    };

export default Location;
