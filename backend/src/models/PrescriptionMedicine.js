const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PrescriptionMedicine = sequelize.define('PrescriptionMedicine', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    prescriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medicineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = PrescriptionMedicine;
