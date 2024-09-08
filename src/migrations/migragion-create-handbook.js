'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Handbooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.INTEGER,
        references: {
          model: 'staff',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image: {
        type: Sequelize.STRING
      },
      descriptionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Descriptions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      image: {
        type: Sequelize.STRING
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
    await queryInterface.addIndex('Handbooks', ['descriptionId'], {
        name: 'fk_handbooks_description_idx'
    });
    await queryInterface.addIndex('Handbooks', ['author'], {
        name: 'fk_handbooks_staff_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Handbooks');
  }
};