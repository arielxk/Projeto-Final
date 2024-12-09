const router = require("express").Router()
const response = require("../utils/responseModel").get()
const autenticar = require("../utils/responseModel")
const { Op } = require('sequelize'); // Importa o Op do Sequelize
const db = require("../models")
const express = require('express'); 
const Modelo = db.Usuario
const ModeloProduto = db.Produto;




router.get("/" , async(req,res) =>{
    try {
        const produtos  = await ModeloProduto.findAll();
        res.render("publico/principal", {
            navegacao: true,
            principal:true, 
            areaLogin:false,
            produtos: produtos.map(p => p.toJSON()), // Converte produtos para JSON

        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        req.flash("error_msg", "Erro ao carregar os produtos!");
        res.redirect("/");
    }
})

router.get("/login",(req,res) =>{
    response.areaLogin=true
    response.principal=false
    response.navegacao=false
    res.render("publico/login",response)
})

router.post("/login",async(req,res) => {
    try{    
        let body = JSON.parse(JSON.stringify(req.body))
        let validacao = body.nome==""?false:true
        validacao &= body.senha==""?false:true    

        if(!validacao){
            req.flash("error_msg" , "Nome do usuário ou senha invalidos")
            res.redirect("/login")
        }else{
            const db = require("../models")
            const Modelo = db.Usuario
            const data = await Modelo.findOne({
                where:{
                    nome:body.nome
                }
            })
            if(!data){
                req.flash("error_msg" , "Nome do usuário ou senha invalidos!")
                res.redirect("/login")
            }else{
                const criptografia = require("../utils/criptografia")
                vef = await criptografia.comparar(body.senha , data.senha)
                if(!vef){
                req.flash("error_msg" , "Nome do usuário ou senha invalidos!")
                res.redirect("/login")
                }else{
                    req.session.user = JSON.parse(JSON.stringify(data))
                    delete req.session.user.senha
                    res.redirect("/privado")
                }
            }
        }

    }catch(erro){
        req.flash("error_msg" , "Registro não encontrado ou inexistente!")
        res.redirect("/login")
    }
})


router.get("/cadastro" ,  (req,res) =>{
    response.principal=false
    response.areaLogin=true 
    res.render("publico/cadastro", response)
})

async function validaData(data) {
    let vef = true
    vef &= data.nome==""?false:true
    vef &= data.senha==""?false:true
    vef &= data.confirmacao==""?false:true

    return vef
}

router.post("/cadastro" ,async (req,res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    let validacao = await validaData(body)
    let erro  = ""
    if(!validacao){
        erro="Dados necessários não foram preenchidos!"
    }else{
        if (body.senha != body.confirmacao) {
            erro = "A senha deve ser igual a confirmação de senha!"
        }else{
            delete body.confirmacao
            const criptografia = require("../utils/criptografia")
            body.senha = await criptografia.encriptar(body.senha)
            const data = await Modelo.create(body)
            body = JSON.parse(JSON.stringify(data))
        }
    }
    if(erro){
        req.flash("error_msg", erro)
        res.redirect("/")
    }else{
        req.flash("success_msg", "Cadastro feito com sucesso!")
        res.redirect("/")
    }
})

router.get("/produto", async (req, res) => {
    try {
        const ModeloProduto = db.Produto;

        // Buscar produtos no banco
        const produtos = await ModeloProduto.findAll();
        // Passar os dados para a view
        res.render("publico/produtos", {
            navegacao: true,
            principal:true, 
            areaLogin:false,
            produtos: produtos.map(p => p.toJSON()), // Converte produtos para JSON
           // Adiciona a variável diretamente
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        req.flash("error_msg", "Erro ao carregar os produtos!");
        res.redirect("/");
    }
});

router.get("/finalizar", async(req,res) => {
    
    res.render("publico/finalizar", {
        navegacao: true,
        principal:true, 
        areaLogin:false,
    })
});

router.use(express.json())

// Suas rotas aqui
router.post('/finalizar',async (req, res) => {
  const cart = req.body;
  res.status(200).send('Carrinho processado com sucesso');
});


router.get("/produto/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/")

        }else{
            
            response.navegacao = true
            response.areaLogin=false
            const data = JSON.parse(JSON.stringify(
                await ModeloProduto.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("publico/detalhesProduto" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/")
    }
   
})


router.get("/pesquisar", async (req, res) => {
    try {
      const termo = req.query.query; // Obtém o termo da URL
      if (!termo || termo.trim() === "") {
        return res.status(400).json([]); // Retorna vazio se o termo for inválido
      }
  
      // Simula consulta ao banco de dados
      const produtos = await ModeloProduto.findAll({
        where: {
          [Op.or]: [
            { nome: { [Op.like]: `%${termo}%` } },
            { descricao: { [Op.like]: `%${termo}%` } }
          ]
        }
      });
  
      res.json(produtos.map(produto => produto.toJSON())); // Envia os resultados como JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });
  
  

module.exports = router