//Configurando Servidor.
const express = require("express")
const server = express()

//Configurar Servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({extended: true}))

//Configurar conexão com o Banco de Dados.
const Pool = require('pg').Pool
const db = new Pool({
    user: '******',
    password: '********',
    host: '******',
    port: ******,
    database: 'doesangue'
})

//Configurando a tamplete engine
const nunjucks = require("nunjucks")
    nunjucks.configure("./",{
        express: server,
        noCache: true, //Boolean ou Booleano = true or false
    })


//Configurar Apresentação da Página
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no Banco de Dados")

        const donors = result.rows
        return res.render("index.html", {donors })
    })
})

server.post("/", function(req, res) {
//req vai Pegar os dados do Formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //Estrutura Condicional
    //Fluxo Ideal
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são Obrigatórios.")
    }

    //Colocando valores do Banco de Dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        //Fluxo de Erro.
        if (err) return res.send("Erro no Banco de Dados")
        
        //Fluxo ideal
        return res.redirect("/")
    })

})

//Ligar o Servidor e Permitir Acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o Servidor.")
})
