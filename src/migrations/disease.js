'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('diseases', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(256),
                allowNull: false,
            },
            diseaseGroupId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'diseasegroups', // Tên bảng users (có thể cần đảm bảo nó khớp với bảng thật trong DB)
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: DataTypes.INTEGER,
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

        // Tạo các index cho các khoá ngoại
        await queryInterface.addIndex('diseases', ['diseaseGroupId'], {
            name: 'fk_disease_diseasegroups_idx'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('diseases');
    }
};