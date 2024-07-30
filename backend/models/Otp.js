const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Otp = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});


Otp.prototype.getOtpJwtToken = function () {
    const token = jwt.sign({ id: this.id }, serverConfig.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '2h'
    });
    return token;
};

module.exports = Otp;
