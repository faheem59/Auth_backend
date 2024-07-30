const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    'Ecommerce',     
    'user',      
    'P@ssW0rd',  
    {
        host: 'localhost', 
        dialect: 'mysql'
    }
);

module.exports = sequelize;
