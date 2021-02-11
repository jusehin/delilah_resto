const dbHost = 'localhost';
const dbName = 'delilah_resto';
const dbUser = 'root';
const dbPassword = '';
const dbPort = '3306';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    dbName, dbUser, dbPassword, {
        host: dbHost,
        dialect: 'mysql',
        port: dbPort,
        dialectOptions: {
            multipleStatements: true
        }
    });

module.exports = sequelize;