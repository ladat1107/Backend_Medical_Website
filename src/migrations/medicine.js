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
            price: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            registrationNumber: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            unit: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            inventory: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            exp: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            approvalNumber: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            approvalDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            dosageForm: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            manufacturerCountry: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            activeIngredient: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            group: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            concentration: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
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