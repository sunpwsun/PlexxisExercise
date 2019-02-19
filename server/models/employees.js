'use strict'

const models = require('./index')

module.exports = (sequelize, Sequelize ) => {
    const Employees =  sequelize.define('employees', {
        employeeId :  {
            type: Sequelize.INTEGER,
            allowNull: true,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        code: {
            type: Sequelize.STRING(16),
            allowNull: false,
            unique: true,
        },
        professionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: models.Professions, key: 'professionId'}
        },
        color: {
            type: Sequelize.STRING(32),
            allowNull: false,
            
        },
        cityId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: models.Cities, key: 'id'}
        },
        branchId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: models.Branches, key: 'id'}
        },
        assigned: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
    }, { timestamps: false })

    return Employees
}