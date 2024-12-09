//configuração do servidor Express
const express = require("express")
const app = new express()

//configuração do body-parser
const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//configuração do hadlebars
const {engine} = require("express-handlebars")
app.engine("handlebars", engine())
app.set("view engine" , "handlebars")
app.set("viwes" , "./views")

//configuração do dotenv
require("dotenv").config()
const porta = process.env.PORTA 

//configuração da sessão 
const session = require("express-session")
app.use(session({
    secret:process.env.SEGREDO,
    resave:true,
    saveUninitialized:true
}))
const flash = require("connect-flash")
app.use(flash())

//configuração do middleware
app.use((req,res,next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//configuração do path
const path = require("path")
app.use(express.static(path.join(__dirname,"../public")))

//iniciando o servidor
app.listen(porta, ()=>{
    console.log(`Server start in : http://localhost:${porta}`)
})

const publico = require("./routes/publico")
app.use("/", publico)

const privado = require("./routes/privado")
app.use("/privado", privado)

//configuração do banco de dados 
const db = require("./models")
db.sequelize.sync().then(() => {
    console.log("Banco de dados sincronizado")
}).catch((erro)=>{
    console.log("Falha ao sincronizar o banco de dados: " + erro.message)
})

const upload = require("./utils/uploadConfig");
app.use(express.static(path.join(__dirname, "../public")));

