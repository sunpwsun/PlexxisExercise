
const cors = require('cors')
const mysql = require('mysql')


// 아래 참고해서 api 분리
// https://github.com/BumjuneKim/sequelize_tutorial/blob/master/app/models/books.js
//

module.exports = ( app ) => {

    const { Employees, Branches, Cities, Professions } = require('../models')


    app.get('/api/employees',  (req, res, next) => {
    console.log('[GET] /api/employees')

        Employees.findAll({  include : [{ model : Cities }, { model : Branches }, { model : Professions } ] })
            .then( e => {
                res.setHeader('Content-Type', 'application/json')
                res.status(200)
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })

    app.get('/api/employee/:id', (req, res, next) => {
        const employeeId = req.params.id
        console.log('[GET] /api/employee/', employeeId )
    
        Employees.findOne( { where : { employeeId },  include : [{ model : Cities }] } )
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    
    app.post('/api/employee/', (req, res, next) => {
        const { name, code, professionId, color, cityId, branchId, assigned } = req.body
console.log('[POST] /api/employee/', name, code, professionId, color, cityId, branchId, assigned )
    
        Employees.create( { 
                employeeId : null,      // auto increment
                name, code, professionId, color, cityId, branchId, assigned
            })
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json({message: 'OK' } )
            })
            .catch( err => {
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })

    app.put( '/api/employee/:id', (req, res, next) => {

        const employeeId = req.params.id
        const { name, code, professionId, color, cityId, branchId, assigned } = req.body
console.log('[PUT] /api/employee/', employeeId, name, code, professionId, color, cityId, branchId, assigned )
        Employees.update( { name, code, professionId, color, cityId, branchId, assigned }, { where : { employeeId } } )
            .then( () => {
                return Employees.findOne({
                    where : { name, code, professionId, color, cityId, branchId, assigned }
                })
            })
            .then((e) => {
                console.log('[PUT] Updated employee: ')
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( {message: 'OK' }  )
            })
            .catch( err => {
                console.log('[put err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message:err})
            })
    })

    app.delete( '/api/employee/:id', (req, res, next) => {

        const employeeId = req.params.id
console.log('[DELETE] /api/employee/', employeeId )
        Employees.destroy( { where : { employeeId } } )
            .then( (e) => {
                if( !e )
                    throw "NO_RECORD"
                console.log('    Delete employee: ', e )
                res.json( {message:'DELETED', cnt: e} )
            })
            .catch( err => {
                console.log('[err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })


    // Branch APIs

    app.get('/api/branches', (req, res, next) => {
        console.log('[GET] /api/branches')
    
        Branches.findAll({})
            .then( e => {
                res.setHeader('Content-Type', 'application/json')
                res.status(200)
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    
    app.get('/api/branch/:id', (req, res, next) => {
        const branchId = req.params.id
        console.log('[GET] /api/branches/', branchId )
    
        Branches.findOne( { where : { branchId } } )
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    



    app.post('/api/branch/', (req, res, next) => {
        const { name, active } = req.body
        console.log('[POST] /api/branches/', name, active )
    
        Branches.create( { 
                branchId : null,
                name, active
            })
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json(  {message: 'OK' } )
            })
            .catch( err => {
                console.log('[err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })


    
    app.put( '/api/branch/:id', (req, res, next) => {

        const branchId = req.params.id
        const { name, active } = req.body
console.log('[PUT] /api/branch/', branchId, name, active )
        Branches.update( { name, active }, { where : { branchId } } )
            .then( () => {
                return Branches.findOne({
                    where : { name, active }
                })
            })
            .then( (e) => {
                console.log('[PUT] Updated branch ')
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json(  {message: 'OK' } )
            })
            .catch( err => {
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )          
                res.send({message: err })
            })
    })
    

    
    // City APIs
    app.get('/api/cities', (req, res, next) => {
        console.log('[GET] /api/cities')
    
        Cities.findAll({})
            .then( e => {
                res.setHeader('Content-Type', 'application/json')
                res.status(200)
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    
    app.get('/api/city/:id', (req, res, next) => {
        const cityId = req.params.id
        console.log('[GET] /api/city/', cityId )
    
        Cities.findOne( { where : { cityId } } )
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    
    app.post('/api/city/', (req, res, next) => {
        const { name, active } = req.body
        console.log('[POST] /api/city/', name, active )
    
        Cities.create( { 
                cityId : null,
                name, active
            })
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( {message: 'OK' }  )
            })
            .catch( err => {
                console.log('[err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })
    
    app.put( '/api/city/:id', (req, res, next) => {

        const cityId = req.params.id
        const { name, active } = req.body
console.log('[PUT] /api/city/', cityId, name, active )
        Cities.update( { name, active }, { where : { cityId } } )
            .then( () => {
                return Cities.findOne({
                    where : { cityId }
                })
            })
            .then( (e) => {
                console.log('[PUT] Updated city ')
                res.setHeader('Content-Type', 'application/json');
                res.status(200)
                res.json( {message: 'OK' } )
            })
            .catch( err => {
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })
    




     // Profession APIs
     app.get('/api/professions', (req, res, next) => {
console.log('[GET] /api/professions')
    
        Professions.findAll({})
            .then( e => {
                res.setHeader('Content-Type', 'application/json')
                res.status(200)
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    
    app.get('/api/profession/:id', (req, res, next) => {
        const professionId = req.params.id
        console.log('[GET] /api/profession/', professionId )
    
        Professions.findOne( { where : { professionId } } )
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( e )
            })
            .catch( err => {
                console.log('[err]', err)
            })
    })
    app.post('/api/city/', (req, res, next) => {
        const { name, active } = req.body
        console.log('[POST] /api/city/', name, active )
    
        Cities.create( { 
                cityId : null,
                name, active
            })
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( {message: 'OK' }  )
            })
            .catch( err => {
                console.log('[err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err })
            })
    })


    app.post('/api/profession/', (req, res, next) => {
        const { name, active } = req.body
        console.log('[POST] /api/profession/', name, active )
    
        Professions.create( { 
                professionId : null,
                name, active
            })
            .then( e => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( {message: 'OK' } )
            })
            .catch( err => {
                console.log('[err]', err)
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message:'err'})
            })
    })
    


    app.put( '/api/profession/:id', (req, res, next) => {

        const professionId = req.params.id
        const { name, active } = req.body
console.log('[PUT] /api/profession/', professionId, name, active )
        Professions.update( { name, active }, { where : { professionId } } )
            .then( () => {
                return Professions.findOne({
                    where : { name, active }
                })
            })
            .then( (e) => {

                console.log('[PUT] Updated profession ')
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.json( {message: 'OK' }  )
            })
            .catch( err => {
                res.setHeader('Content-Type', 'application/json')
                res.status( 200 )           //// check return code  again
                res.send({message: err})
            })
    })   
}