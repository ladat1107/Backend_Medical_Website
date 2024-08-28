const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('databaseName', 'root', "password", {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    logging: false,
    dialectOptions: {
        useUTC: false
    },
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