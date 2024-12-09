const router = require("express").Router()
const response = require("../utils/responseModel").get()
const db = require("../models")
const Modelo = db.Fornecedor
response.areaPrivada=true

response.usuario="Ariel"

router.get("/" ,async(req,res) =>{
    try {
        const data = JSON.parse(JSON.stringify(
            await Modelo.findAll()
        ))
        if(data.length){
            response.dados = data
            response.total = data.length
            res.render("privado/fornecedores/lista", response)
        }else{
            delete response.dados
            delete response.total
            response.msg = ("Registros não encontrados ou inexistente!")
            res.render("privado/fornecedores/lista", response)
        }

    } catch (erro) {
        req.flash("error_msg" , "Houve um erro na execução!")
        response.msg = ("Registros não encontrados ou inexistentes!")
        res.render("privado/fornecedores/lista", response)
    }

    
})

router.get("/novo" , (req,res) =>{
    res.render("privado/fornecedores/novo", response)
})
async function validaData(data) {
    let vef = true
    vef &= data.nome==""?false:true
   

    return vef
}

router.post("/novo" ,async (req,res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    let validacao = await validaData(body)
    let erro  = ""
    
    if(!validacao){

        erro="Dados necessários não foram preenchidos!"
    
    }else{
            const data = await Modelo.create(body)
            body = JSON.parse(JSON.stringify(data))
        
    }
    if(erro){
        req.flash("error_msg", erro)
        res.redirect("/privado/fornecedores/novo")
    }else{
        req.flash("success_msg", "Fornecedor cadastrado com sucesso!")
        res.redirect("/privado/fornecedores")
    }
})

router.get("/find/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/fornecedores")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/fornecedores/detalhe" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/fornecedores")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/fornecedores")
    }
   
})



router.get("/editar/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/fornecedores")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/fornecedores/editar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/fornecedores")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/fornecedores")
    }
   
})

router.post("/editar/:id" , async (req,res) =>{
    try{
        if(isNaN(req.params.id)){
            req.flash("error_msg","Registro não encontrado ou inexistente.")
            res.redirect("/privado/fornecedores")
        }else{
            const data = await Modelo.findByPk(req.params.id)
            if(data){
                let erro = ""
                let body = JSON.parse(JSON.stringify(req.body))
                let validacao = body.nome==""?false:true
                if(!validacao){
                    erro="Os dados necessários não preenchidos!"
                }else{
                    const atual = await data.update(body)
                    body = JSON.parse(JSON.stringify(atual))
                }

                if(erro){
                    req.flash("error_msg",erro)
                    res.redirect(`/privado/fornecedores/editar/${req.params.id}`)
                }else{
                    req.flash("success_msg","Fornecedor editado com sucesso!")
                    res.redirect("/privado/fornecedores")
                }
            }else{
                req.flash("error_msg","Registro não encontrado ou inexistente.")
                res.redirect("/privado/fornecedores")

            }

        }

    }catch(erro){
        req.flash("error_msg","Houve um erro na execução do pedido")
        res.redirect("/privado/fornecedores")

    }
})

router.get("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/fornecedores")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))

                if(data){
                    response.dados = data
                    res.render("privado/fornecedores/deletar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/fornecedores")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/fornecedores")
    }
   
})

router.post("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/fornecedores")

        }else{
            
            const data = await Modelo.destroy({
                where:{
                    id: req.params.id
                }
            })

                if(data){
                    req.flash("success_msg" , "Fornecedor deletado com sucesso!")
                    res.redirect("/privado/fornecedores")
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/fornecedores")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/fornecedores")
    }
   
})


module.exports = router