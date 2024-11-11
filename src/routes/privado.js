const router = require("express").Router()
const autenticar = require("../utils/responseModel")

 
router.get("/" ,autenticar.verificarAcesso,(req,res) =>{
    let response = autenticar.get(true)
    res.render("privado/principal", response)
})

router.get("/sair",(req,res) => {
    delete req.session.user
    res.redirect("/")
})

const usuarios = require("./usuarioController")
router.use("/usuarios/" ,usuarios)


const produtos = require("./produtoController")
router.use("/produtos/" ,produtos)


const categorias = require("./categoriaController")
router.use("/categorias/" ,categorias)


module.exports = router
