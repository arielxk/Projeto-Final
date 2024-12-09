module.exports = (sequelize,Sequelize) =>{
    const Usuario = sequelize.define('usuario' , {
        id:{
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
            type:Sequelize.INTEGER
        },
        nome:{
            allowNull:false,
            type:Sequelize.STRING
        },
        email:{
            allowNull:false,
            type:Sequelize.STRING
        },
        senha:{ 
            allowNull:false,
            type:Sequelize.STRING
        }
    })
    return Usuario
}