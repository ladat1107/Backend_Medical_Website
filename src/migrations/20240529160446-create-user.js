'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true,  // UNIQUE KEY email_UNIQUE
      },
      cid: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,  // UNIQUE KEY cid_UNIQUE
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      currentResident: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,  // UNIQUE KEY phoneNumber_UNIQUE
      },
      avatar: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      folk: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nationality: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ABOBloodGroup: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      RHBloodGroup: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maritalStatus: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      point: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};