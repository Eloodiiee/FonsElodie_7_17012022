const mysql = require("mysql")
exports.connection = mysql.createPool({
    host: "localhost",
    user: "adminGroupomania",
    password: "adminGroupomania",
    database: "Groupomania",
    timezone: "local"
})

