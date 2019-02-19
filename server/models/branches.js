'use strict'

module.exports =(sequelize, Sequelize) => {
    const Branches =  sequelize.define( 'branches', {
        branchId :  {
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
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
    },
    {
        timestamps: false
    })

    return Branches
}