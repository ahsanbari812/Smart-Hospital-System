const { sequelize } = require('../models');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = syncDatabase;
