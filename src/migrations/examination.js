'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('examinations', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users', // Tham chiếu đến bảng users
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            staffId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'staffs', // Tham chiếu đến bảng staffs
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            symptom: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            diseaseName: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            treatmentResult: {
                type: Sequelize.STRING(45),
                allowNull: true,
            },
            admissionDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            dischargeDate: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            reason: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            medicalTreatmentTier: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            paymentDoctorStatus: {
                type: Sequelize.INTEGER,
                allowNull: false,
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

        // Tạo chỉ mục cho staffId
        await queryInterface.addIndex('examinations', ['staffId'], {
            name: 'fk_examination_staff_idx'
        });

        // Tạo chỉ mục cho userId
        await queryInterface.addIndex('examinations', ['userId'], {
            name: 'fk_examination_user_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('examinations');
    }
};