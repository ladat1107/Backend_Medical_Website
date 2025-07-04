const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
        dialectOptions:
            process.env.DB_SSL === 'true' ?
                {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false
                    }
                } : {},

        timezone: "+07:00",
        raw: true,
    });

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDB;
