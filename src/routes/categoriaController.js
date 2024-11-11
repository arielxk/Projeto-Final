const router = require("express").Router()
const response = require("../utils/responseModel").get()
const db = require("../models")
const Modelo = db.Categoria
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
            res.render("privado/categorias/lista", response)
        }else{
            delete response.dados
            delete response.total
            response.msg = ("Registros não encontrados ou inexistente!")
            res.render("privado/categorias/lista", response)
        }

    } catch (erro) {
        req.flash("error_msg" , "Houve um erro na execução!")
        response.msg = ("Registros não encontrados ou inexistentes!")
        res.render("privado/categorias/lista", response)
    }

    
})

router.get("/novo" , (req,res) =>{
    res.render("privado/categorias/novo", response)
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
        res.redirect("/privado/categorias/novo")
    }else{
        req.flash("success_msg", "Categoria cadastrado com sucesso!")
        res.redirect("/privado/categorias")
    }
})

router.get("/find/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/categorias")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/categorias/detalhe" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/categorias")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/categorias")
    }
   
})



router.get("/editar/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/categorias")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/categorias/editar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/categorias")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/categorias")
    }
   
})

router.post("/editar/:id" , async (req,res) =>{
    try{
        if(isNaN(req.params.id)){
            req.flash("error_msg","Registro não encontrado ou inexistente.")
            res.redirect("/privado/categorias")
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
                    res.redirect(`/privado/categorias/editar/${req.params.id}`)
                }else{
                    req.flash("success_msg","Categoria editada com sucesso!")
                    res.redirect("/privado/categorias")
                }
            }else{
                req.flash("error_msg","Registro não encontrado ou inexistente.")
                res.redirect("/privado/categorias")

            }

        }

    }catch(erro){
        req.flash("error_msg","Houve um erro na execução do pedido")
        res.redirect("/privado/categorias")

    }
})

router.get("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/categorias")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))

                if(data){
                    response.dados = data
                    res.render("privado/categorias/deletar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/categorias")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/categorias")
    }
   
})

router.post("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/categorias")

        }else{
            
            const data = await Modelo.destroy({
                where:{
                    id: req.params.id
                }
            })

                if(data){
                    req.flash("success_msg" , "Categoria deletado com sucesso!")
                    res.redirect("/privado/categorias")
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/categorias")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/categorias")
    }
   
})


module.exports = router