require("dotenv").config();
const Sequelize = require("sequelize");
const DB_USERNAME = process.env.DB_USERNAME;
const GCP_DB_PASSWORD = process.env.GCP_DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const GCP_DB_PRIVATE_IP = process.env.GCP_DB_PRIVATE_IP;
const DB_PORT = process.env.DB_PORT;
const DATABASE_URL = `postgresql://${DB_USERNAME}:${GCP_DB_PASSWORD}@${GCP_DB_PRIVATE_IP}:${DB_PORT}/${DB_NAME}?schema=public`;

module.exports = new Sequelize(DATABASE_URL);
