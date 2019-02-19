const express = require( 'express' )
const cors = require( 'cors' )
const app = express()
const bodyParser = require('body-parser')
const employees = require( './data/employees.json' );
const restapis = require('./routes/restapis')
const sequelize = require( './models/index' ).sequelize
sequelize.sync()


app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})


// [CONFIGURE APP TO USE bodyParser]
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


restapis(app) 

app.listen(8080, () => console.log('Job Dispatch API running on port 8080!'))