const Sequelize = require("sequelize");
const { FORCE } = require("sequelize/lib/index-hints");
require("dotenv").config();


const database = process.env.DB
const user = process.env.DBUSER
const pass = process.env.DBPASS
const host = process.env.DBHOST
const dialect = process.env.DBDIALECT

const sequelize = new Sequelize(database,user,pass,{
    host:host,
    dialect:dialect,
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.Usuario = require("./Usuario")(sequelize,Sequelize)
db.Produto = require("./Produto")(sequelize,Sequelize)
db.Fornecedor = require("./Fornecedor")(sequelize,Sequelize) 

db.Produto.belongsTo(db.Fornecedor,{
    constraint: true,
    foreigtKey: 'idFornecedor'

})

db.Fornecedor.hasMany(db.Produto,{
    constraint : true,
    foreigtKey :'idFornecedor'  
})


module.exports = db