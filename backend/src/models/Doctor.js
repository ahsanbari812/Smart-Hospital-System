const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
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
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fees: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
});

module.exports = Doctor;
