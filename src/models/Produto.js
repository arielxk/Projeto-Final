
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
            type:Sequelize.DECIMAL
        },
        categoria:{
            allowNull:true,
            type:Sequelize.STRING
        },
        qtdEstoque:{
            allowNull:true,
            type:Sequelize.INTEGER
        },
        precoPromo:{
            type:Sequelize.DECIMAL
        },
        imagem:{
            allowNull:true,
            type:Sequelize.STRING
        }
        
    })

    return Produto
}