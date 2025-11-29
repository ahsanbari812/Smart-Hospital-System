const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LabTest = sequelize.define('LabTest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    labTestCatalogId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    testDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    resultUrl: {
        type: DataTypes.STRING, // Path to uploaded file
        allowNull: true
    },
    resultData: {
        type: DataTypes.JSON, // Structured test results
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('ordered', 'in-progress', 'completed', 'cancelled'),
        defaultValue: 'ordered'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = LabTest;
