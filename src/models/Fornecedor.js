module.exports = (sequelize,Sequelize) =>{
    const Fornecedor = sequelize.define('fornecedor',{
        id:{
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
            type:Sequelize.INTEGER
        },
        CNPJ:{
            allowNull:false,
            type:Sequelize.STRING
        },
        nome:{
            allowNull:false,
            type:Sequelize.STRING
        },
        descricao:{
            allowNull:false,
            type:Sequelize.STRING
        },
        email:{
            allowNull:false,
            type:Sequelize.STRING
        },
        telefone:{
            allowNull:false,
            type:Sequelize.STRING
        },
        endereco:{
            allowNull:false,
            type:Sequelize.STRING
        }
        
    });

    return Fornecedor
}