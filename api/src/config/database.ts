import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

if (!dbHost || !dbUser || !dbPassword || !dbName) {
  throw new Error("Missing database configuration. Please check .env file.");
}

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false, // Set to console.log to see SQL queries
  timezone: "+00:00", // Store all timestamps in UTC
  dialectOptions: {
    timezone: "+00:00", // Ensure MySQL connection uses UTC
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    // Sync models
    await sequelize.sync();
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
