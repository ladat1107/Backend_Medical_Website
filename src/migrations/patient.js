'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('patients', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            dateOfAdmission: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateOfDischarge: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            bedId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'beds', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
            }
        });

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('patients', ['userId'], {
            name: 'fk_patients_user_idx'
        });
        await queryInterface.addIndex('patients', ['bedId'], {
            name: 'fk_patients_bed_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('patients');
    }
};