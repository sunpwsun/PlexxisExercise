# Plexxis Interview Exercise
## About this application
This is for the assessment for full-stack position at Plexxis.
It is a simple but robust React application accessing MariaDB on Amazon RDS.
It was really a challenging but interesting work for me because it was another opportunity to meet useful libraries like react-table or sequelize although there was a learning curve to learn them. ( But I am comfortable with them the ins and outs. )

## How to run
Follow the steps:

1) git clone https://github.com/sunpwsun/PlexxisExercise.git
2) cd PlexxisExercise
3) npm install
4) npm start

## Used Libraries 
1) Back-end :
 - Node.js
 - MariaDB on Amazon RDS
 - sequelize (OMR for MariaDB)
 
2) Front-end :
 - React.js
 - react-table for displaying data
 - axios for accessing DBMS
 
## Features
1) It fetches and presents the employees data.
2) It adds new employee's record.
3) It updates and delete employee's record.
 
## REST API
|  URL               |Param    |Method  |    Description                        |
|--------------------|---------|--------|---------------------------------------|
|/api/employees      |-     | GET    | Read all employees' records           |
|/api/employee/:id   |id       | GET    | Read a employee's record with the id  |
|/api/employee      |employee | POST   | Create a new record                   |
|/api/employee/:id  |id       | PUT   | Update the record with id             |
|/api/employee/:i   |id       | DELETE | Remove the record with id             |
|/api/cities      |-     | GET    | Read all citys           |
|/api/city/:id   |id       | GET    | Read a city record with the id  |
|/api/city      |city | POST   | Create a new city                   |
|/api/city/:id  |id       | PUT   | Update the city record with id             |
|/api/branches      |-     | GET    | Read all branches           |
|/api/branch/:id   |id       | GET    | Read a city branch with the id  |
|/api/branch      |branch | POST   | Create a new branch                   |
|/api/branch/:id  |id       | PUT   | Update the branch record with id             |
|/api/professions      |-     | GET    | Read all professions           |
|/api/profession/:id   |id       | GET    | Read a profession record with the id  |
|/api/profession      |profession | POST   | Create a new record                   |
|/api/profession/:id  |id       | PUT   | Update the record with id             |

