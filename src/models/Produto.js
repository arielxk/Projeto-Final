module.exports = (sequelize,Sequelize) =>{
    const Produto = sequelize.define('produto' , {
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
        preco:{
            allowNull:false,
            type:Sequelize.INTEGER
        }
        
    })
    return Produto
}