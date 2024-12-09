const router = require("express").Router()
const response = require("../utils/responseModel").get()
const db = require("../models")
const Modelo = db.Produto
response.areaPrivada=true

const upload = require("../utils/uploadConfig");



response.usuario="Ariel"



router.post("/privado/upload", upload.single("imagem"), (req, res) => {
    try {
        if (!req.file) {
            req.flash("error_msg", "Nenhuma imagem foi enviada!");
            return res.redirect("/privado");
        }

        // O arquivo foi salvo com sucesso
        const caminhoImagem = `/img/${req.file.filename}`;
        req.flash("success_msg", `Imagem salva em: ${caminhoImagem}`);
        res.redirect("/privado");
    } catch (error) {
        console.error("Erro no upload:", error);
        req.flash("error_msg", "Erro ao fazer upload da imagem.");
        res.redirect("/privado");
    }
});

router.get("/", async (req, res) => {
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
            response.search = search || ''; // Fallback para garantir que search sempre seja uma string
            res.render("privado/produtos/lista", response);
        } else {
            delete response.dados;
            delete response.total;
            response.search = search || ''; // Fallback para garantir que search sempre seja uma string
            response.msg = "Nenhum registro encontrado para o termo pesquisado!";
            res.render("privado/produtos/lista", response);
        }
    } catch (erro) {
        req.flash("error_msg", "Houve um erro na execução!");
        response.msg = "Erro ao carregar registros.";
        res.render("privado/produtos/lista", response);
    }
});


router.get("/novo" , (req,res) =>{
    res.render("privado/produtos/novo", response)
})
async function validaData(data) {
    let vef = true
    vef &= data.nome==""?false:true
   
    return vef
}

router.post("/novo", upload.single("imagem"), async (req, res) => {
    try {
        const body = req.body;

        // Salva o caminho da imagem no banco de dados, se enviado
        if (req.file) {
            body.imagem = `/img/${req.file.filename}`;
        }

        // Validação simples
        if (!body.nome || !body.preco) {
            req.flash("error_msg", "Os campos Nome e Preço são obrigatórios.");
            return res.redirect("/privado/produtos/novo");
        }

        // Salva o produto no banco de dados
        await Modelo.create(body);

        req.flash("success_msg", "Produto cadastrado com sucesso!");
        res.redirect("/privado/produtos");
    } catch (error) {
        console.error(error);
        req.flash("error_msg", "Houve um erro ao salvar o produto.");
        res.redirect("/privado/produtos/novo");
    }
});


router.get("/find/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/produtos")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/produtos/detalhe" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/produtos")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/produtos")
    }
   
})



router.get("/editar/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/produtos")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))
                if(data){
                    response.dados = data
                    res.render("privado/produtos/editar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/produtos")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/produtos")
    }
   
})

router.post("/editar/:id" , async (req,res) =>{
    try{
        if(isNaN(req.params.id)){
            req.flash("error_msg","Registro não encontrado ou inexistente.")
            res.redirect("/privado/produtos")
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
                    res.redirect(`/privado/produtos/editar/${req.params.id}`)
                }else{
                    req.flash("success_msg","Produto editado com sucesso!")
                    res.redirect("/privado/produtos")
                }
            }else{
                req.flash("error_msg","Registro não encontrado ou inexistente.")
                res.redirect("/privado/produtos")

            }

        }

    }catch(erro){
        req.flash("error_msg","Houve um erro na execução do pedido")
        res.redirect("/privado/produtos")

    }
})

router.get("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/produtos")

        }else{
            
            const data = JSON.parse(JSON.stringify(
                await Modelo.findByPk(req.params.id)
            ))

                if(data){
                    response.dados = data
                    res.render("privado/produtos/deletar" , response )
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/produtos")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/produtos")
    }
   
})

router.post("/delete/:id", async (req,res) => {
    try{
        if(isNaN(req.params.id)){
            
            req.flash("error_msg" , "Registro não encontrado!")
            res.redirect("/privado/produtos")

        }else{
            
            const data = await Modelo.destroy({
                where:{
                    id: req.params.id
                }
            })

                if(data){
                    req.flash("success_msg" , "Produto deletado com sucesso!")
                    res.redirect("/privado/produtos")
                }else{
                    req.flash("error_msg" , "Registro não encontrado!")
                    res.redirect("/privado/produtos")
                }
        }
        
    }catch(erro){
        req.flash("error_msg" , "Houve um erro na execução do problema")
        res.redirect("/privado/produtos")
    }
   
})


module.exports = router