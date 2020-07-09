const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const sql = require("mssql");

const server = express()

//conexão com o bd
const connStr = "Server=localhost;Database=Teste;User Id=sa;Password=123;";
sql.connect(connStr)
   .then(conn => console.log("conectou!"))
   .catch(err => console.log("erro! " + err));

   //fazendo a conexão global
sql.connect(connStr)
.then(conn => GLOBAL.conn = conn)
.catch(err => console.log(err));

   
function execSQLQuery(sqlQry, res){
    GLOBAL.conn.request()
               .query(sqlQry)
               .then(result => res.json(result.recordset))
               .catch(err => res.json(err));
}


server.use(express.static('public'))

// Template Engine 
server.set("view engine","njk")
nunjucks.configure("views",{
    express:server
})

//body parser
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

//arquivos estaticos
server.use(express.static('/'))

//rotas
server.get("/", function(req,res) {
    return res.render("about")
})

server.post("/add", (req, res) =>{
    const produto = req.body.nome.substring(0,120);
    const qtde = parseInt(req.body.qtde);
    const valor = parseInt(req.body.valor);

    execSQLQuery(`INSERT INTO pedidos(produto, qtde, valor_unit) VALUES('${produto}',${qtde},${valor})`,res);
})



server.listen(5000, function(){
    console.log('Server is running')
}) /*Porta que servidor usara */