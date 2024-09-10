'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('insurances', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            insuanceCode: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            dateOfIssue: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            exp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            benefitLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            residentialCode: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            initialHealthcareRegistrationCode: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            continuousFiveYearPeriod: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Bảng `users`
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        });

        // Tạo chỉ mục cho userId
        await queryInterface.addIndex('insurances', ['userId'], {
            name: 'fk_insuances_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('insurances');
    }
};