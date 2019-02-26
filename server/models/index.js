'use strict';


const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(
    path.join(__dirname + '../..', 'config', 'config.json')
)[env];


const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
)



db.sequelize = sequelize
db.Sequelize = Sequelize


db.Cities = require( './cities' )( sequelize, Sequelize )
db.Branches = require( './branches' )( sequelize, Sequelize )
db.Professions = require( './professions' )( sequelize, Sequelize )
db.Employees = require('./employees')( sequelize, Sequelize )


// Associates
db.Cities.hasMany( db.Employees,   { foreignKey: 'cityId' })
db.Employees.belongsTo( db.Cities, { foreignKey: 'cityId', targetKey: 'cityId'});

db.Branches.hasMany( db.Employees,   { foreignKey: 'branchId' })
db.Employees.belongsTo( db.Branches, { foreignKey: 'branchId', targetKey: 'branchId'});

db.Professions.hasMany( db.Employees,   { foreignKey: 'professionId' })
db.Employees.belongsTo( db.Professions, { foreignKey: 'professionId', targetKey: 'professionId'});


module.exports = db