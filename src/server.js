const express = require("express")
const server = express()

// pegar o banco de dados 
const db = require("./database/db")

//configurar pasta publica 
server.use(express.static("public"))


// habilitar o uso do req.body na aplicação 


server.use(express.urlencoded({ extended: true}))



// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views",{
    express: server,
    noCache: true
})




// configurar caminhos da minha aplicação

// pagina inicial
// req : requisição
// res : resposta
server.get("/",(req,res)=>{
  return res.render("index.html", {title:"Um titulo"})
})

server.get("/create-point",(req,res)=>{
    // req.query: Query /strings da nossa url
    //console.log(req.query)

   return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

  // rep.body: corpo do formulario
  //console.log(req.body)

  // inserir dados no BD

  const query =  `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
      req.body.image,
      req.body. name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items
    ]
    function afterInsertData (err){
      if (err) {
           console.log(err)
           return res.send("Erro no cadastro!")
          
      }
      console.log("cadastrado com sucesso")
      console.log(this)

      return res.render("create-point.html", { saved: true })

  }
  db.run( query, values, afterInsertData )



})




server.get("/search-results",(req,res)=>{

  const search = req.query.search

  if(search ==""){
    //pesquisa vazia
    return res.render("search-results.html", { total:0 })

  }

// pegar os dados do Banco de dados

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}' `, function(err, rows) {
      if (err) {
        return console.log(err)
    }
      console.log(rows)

      const total = rows.length 
    //Mostrar a página html com os dados do banco de dados
    return res.render("search-results.html", { places: rows, total: total })
  })

   
})

// ligar o servidor 
server.listen(3000)


//parei no 1:33:39 da aula 5