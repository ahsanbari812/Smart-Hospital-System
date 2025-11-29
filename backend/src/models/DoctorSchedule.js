const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// New table to normalize Doctor's schedule
const DoctorSchedule = sequelize.define('DoctorSchedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dayOfWeek: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['doctorId', 'dayOfWeek']
        }
    ]
});

module.exports = DoctorSchedule;
