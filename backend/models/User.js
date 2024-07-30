const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 
const sequelize = require('../db/conn'); 
const jwt = require("jsonwebtoken");
const serverConfig = require('../config/server-config');



const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
      allowNull:false  
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'customers', 
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});


User.prototype.getJwtToken = function () {
    const token = jwt.sign({ id: this.id }, serverConfig.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '2h'
    });
    return token;
};


module.exports = User;
