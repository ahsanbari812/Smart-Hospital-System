const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// New table to normalize medicines catalog
const Medicine = sequelize.define('Medicine', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    genericName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Medicine;
