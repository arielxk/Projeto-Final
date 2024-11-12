const router = require("express").Router()
const response = require("../utils/responseModel").get()

router.get("/" , (req,res) =>{
    res.render("publico/principal" , response)
})

router.get("/login",(req,res) =>{
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

router.get("/cadastro",(req,res) =>{
    res.render("publico/cadastro",response)
})

router.post("/cadastro",async(req,res) => {
    try{    
        let body = JSON.parse(JSON.stringify(req.body))
        let validacao = body.nome==""?false:true
        validacao &= body.senha==""?false:true    

        if(!validacao){
            req.flash("error_msg" , "Nome do usuário ou senha invalidos")
            res.redirect("/cadastro")
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
                res.redirect("/cadastro")
            }else{
                const criptografia = require("../utils/criptografia")
                vef = await criptografia.comparar(body.senha , data.senha)
                if(!vef){
                req.flash("error_msg" , "Nome do usuário ou senha invalidos!")
                res.redirect("/cadastro")
                }else{
                    req.session.user = JSON.parse(JSON.stringify(data))
                    delete req.session.user.senha
                    res.redirect("/privado")
                }
            }
        }

    }catch(erro){
        req.flash("error_msg" , "Registro não encontrado ou inexistente!")
        res.redirect("/cadastro")
    }
})
module.exports = router
