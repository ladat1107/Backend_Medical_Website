'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        
        await queryInterface.createTable('prescriptiondetails', {
            prescriptionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'prescriptions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            medicineId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'medicines',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            unit: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            dosage: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
        await queryInterface.addIndex('prescriptiondetails', ['medicineId'], {
            name: 'fk_presdetail_medicine'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('prescriptiondetails');
    }
};