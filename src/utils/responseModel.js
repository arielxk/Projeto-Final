let nome = "Ariel"
let id  = 0
function get(valor) {
    return response = {
        nomeSite:process.env.Nome,
        areaPrivada:valor,
        usuario:nome,
        id:id
    }
}

function verificarAcesso(req,res,next){
    if(req.session.user){
        nome = req.session.user.nome
        id = req.session.user.id
        next()
    }else{
        req.flash("error_msg" ,  "Por favor, realize login")
        res.redirect("/login")
    }
}

module.exports = {get,verificarAcesso}