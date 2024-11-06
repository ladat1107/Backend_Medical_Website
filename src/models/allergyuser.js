'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AllergyUser extends Model {
        static associate(models) {
            // AllergyUser.belongsTo(models.Allergy, {
            //     foreignKey: 'allergyId',
            //     as: 'allergyUserAllergyData',
            // });
            // AllergyUser.belongsTo(models.User, {
            //     foreignKey: 'userId',
            //     as: 'allergyUserUserData',
            // });
        }
    }
    AllergyUser.init({
        allergyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'allgergies', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Tên bảng tham chiếu
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        discoveryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },

    }, {
        sequelize,
        modelName: 'AllergyUser',
    });
    return AllergyUser;
};