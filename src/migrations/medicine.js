'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('medicines', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(256),
                allowNull: false,
            },
            unitPrice: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            unit: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            inventory: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            exp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },
            createAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updateAt: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('medicines');
    }
};