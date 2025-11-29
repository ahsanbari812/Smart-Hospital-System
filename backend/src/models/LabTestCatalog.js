const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// New table to normalize lab test catalog
const LabTestCatalog = sequelize.define('LabTestCatalog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    testName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    testCode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    normalRange: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sampleType: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = LabTestCatalog;
