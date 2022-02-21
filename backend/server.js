const app = require('./app')
const http = require('http')

const port = 3000


//Déclaration du port d'écoute du serveur
app.set("port", process.env.PORT || port)
//Permet de créer un serveur à partir de l'app
const server = http.createServer(app);

//Gestionnaire d'évènements
server.on("listening", ()=> {
    console.log(`Listening on ${port}`)
})
server.listen(process.env.PORT || port);