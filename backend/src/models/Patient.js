const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
    }
});

module.exports = Patient;
