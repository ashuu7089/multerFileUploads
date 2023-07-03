const { Sequelize } = require("sequelize")

const sequelize  = new Sequelize(process.env.databaseName, process.env.user, process.env.password ,{
        host : 'localhost',
        dialect : 'mysql'
    });
    try{
        sequelize.authenticate();
        console.log("database connection successfull")
    }catch(error){
        console.log(error)
    }    

module.exports = sequelize;