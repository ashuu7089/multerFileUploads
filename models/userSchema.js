const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("./config")

const userSchema = sequelize.define('user', {
    userEmail : {
        type : DataTypes.STRING,
        allowNull : false   
    },
    userName : {
        type : DataTypes.STRING,
        allowNull : true   
    },
    userPassword : {
        type : DataTypes.CHAR,
        allowNull : false
    },
    userProfile : {
        type : DataTypes.BLOB('long'),
        allowNull : false
    }
  
})
userSchema.sync({ alter : true })

module.exports = userSchema
