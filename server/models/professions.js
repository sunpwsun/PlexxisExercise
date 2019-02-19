'use strict'

module.exports =(sequelize, Sequelize) => {
    const Professions = sequelize.define( 'professions', {
        professionId :  {
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
        timestamps: false,
    })

    return Professions
}