// Database connection singleton for Sequelize
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get database connection details from environment variables
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
} = process.env;

// Create Sequelize instance
const sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize; 