const router = require("express").Router()
const autenticar = require("../utils/responseModel")
const db = require("../models")
const Modelo = db.Usuario


router.get("/",autenticar.verificarAcesso, async (req, res) => {
    try {
        const { search } = req.query; // Obtém o parâmetro de pesquisa
        let query = {};

        // Adiciona a condição de busca, se aplicável
        if (search) {
            query = {
                where: {
                    nome: {
                        [db.Sequelize.Op.like]: `%${search}%`, // Busca pelo nome contendo o termo
                    },
                },
            };
        }

        // Busca no banco com ou sem filtro
        const data = JSON.parse(
            JSON.stringify(await Modelo.findAll(query))
        );

        if (data.length) {
            response.dados = data;
            response.total = data.length;
            res.render("privado/usuarios/lista", response);
        } else {
            delete response.dadaos;
            delete response.totaal;
            response.search = search || ''; // Fallback para garantir que search sempre seja uma string
            response.msg = "Nenhum registro encontrado para o termo pesquisado!";
            res.render("privado/usuarios/lista", response);
        }
    } catch (erro) {
        req.flash("error_msg", "Houve um erro na execução!");
        response.msg = "Erro ao carregar registros.";
        res.render("privado/usuarios/lista", response);
    }
});



router.get("/novo" , autenticar.verificarAcesso, (req,res) =>{
    res.render("privado/usuarios/novo", response)
})

async function validaData(data) {
    let vef = true
    vef &= data.nome==""?false:true
    vef &= data.senha==""?false:true
    vef &= data.confirmacao==""?false:true

    return vef
}

router.post("/novo" ,autenticar.verificarAcesso, async (req,res) => {
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
        res.redirect("/privado/usuarios/novo")
    }else{
        req.flash("success_msg", "Usuário cadastrado com sucesso!")
        res.redirect("/privado/usuarios")
    }
})

router.get("/find/:id", autenticar.verificarAcesso, async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/usuarios")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
           
                if(data){
                    response.dados = data
                    res.render("privado/usuarios/detalhe" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/usuarios")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/usuarios")
    }
   
})



router.get("/editar/:id", autenticar.verificarAcesso, async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/usuarios")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/usuarios/editar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/usuarios")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/usuarios")
    }
   
})

router.post("/editar/:id" , autenticar.verificarAcesso, async (req,res) =>{
    try{
        if(isNaN(req.params.id)){
            req.flash("error_msg","Registro não encontrado ou inexistente.")
            res.redirect("/privado/usuarios")
        }else{
            const data = await Modelo.findByPk(req.params.id)
            if(data){
                let erro = ""
                let body = JSON.parse(JSON.stringify(req.body))
                let validacao = body.nome==""?false:true
                console.log(validacao)
                validacao &= body.email==""?false:true
                console.log(validacao)
                if(body.senha != body.confirmacao){
                    erro="A senha deve ser igual a confirmação de senha"
                }else if(!validacao){
                    erro="Os dados necessários não preenchidos!"
                }else{
                    delete body.confirmacao

                    if(body.senha==""){
                        delete body.senha

                    }else{
                        const criptografia = require("../utils/criptografia")
                        body.senha = await criptografia.encriptar(body.senha)
                    }
                    const atual = await data.update(body)
                    body = JSON.parse(JSON.stringify(atual))
                }
                if(erro){
                    req.flash("error_msg",erro)
                    res.redirect(`/privado/usuarios/editar/${req.params.id}`)
                }else{
                    req.flash("success_msg","Usuário editado com sucesso!")
                    res.redirect("/privado/usuarios")
                }
            }else{
                req.flash("error_msg","Registro não encontrado ou inexistente.")
                res.redirect("/privado/usuarios")

            }

        }

    }catch(erro){
        req.flash("error_msg","Houve um erro na execução do pedido")
        res.redirect("/privado/usuarios")

    }
})

router.get("/delete/:id", autenticar.verificarAcesso, async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/usuarios")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))

                if(data){
                    response.dados = data
                    res.render("privado/usuarios/deletar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/usuarios")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/usuarios")
    }
   
})

router.post("/delete/:id", autenticar.verificarAcesso, async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/usuarios")

        }else{
            
            const data = await Modelo.destroy({
                where:{
                    id: req.params.id
                }
            })
                if(data){
                    req.flash("success_msg" , "Usuário deletado com sucesso!")
                    res.redirect("/privado/usuarios")
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/usuarios")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/usuarios")
    }
   
})


module.exports = router