const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Prescription;
