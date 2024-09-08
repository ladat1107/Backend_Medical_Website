'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('location', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            },
            floor: {
            type: DataTypes.STRING(255),
            allowNull: false,
            },
            status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            },
            description: {
            type: DataTypes.STRING(512),
            allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('location');
    }
};