module.exports = (sequelize,Sequelize) =>{
    const Categoria = sequelize.define('categoria' , {
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
        descricao:{
            allowNull:false,
            type:Sequelize.STRING
        },
        tipo:{
            allowNull:false,
            type:Sequelize.STRING
        },
        tempo:{
            allowNull:false,
            type:Sequelize.STRING
        }
    })
    return Categoria
}