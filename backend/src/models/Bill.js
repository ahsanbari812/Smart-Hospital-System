const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('unpaid', 'paid'),
        defaultValue: 'unpaid'
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Bill;
