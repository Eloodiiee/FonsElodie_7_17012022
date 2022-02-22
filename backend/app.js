const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const cors = require('cors')

const userRoutes= require("./routes/userRoutes")
const postRoutes= require("./routes/postRoutes")

//La connection à la base de données est déclarée dans le fichier "connection.js"

app.use(cors());
app.use(bodyParser.json());
//Ouverture des chemins d'accès à l'api
app.use("/images", express.static("./images"))
app.use("/api/auth", userRoutes)
app.use("/api/post", postRoutes)

module.exports = app;