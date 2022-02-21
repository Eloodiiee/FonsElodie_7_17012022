// MODULES
const mysql = require('../connection.js').connection //CONNEXION TO DATABASE
const bcrypt = require('bcrypt'); // TO CRYPTE PASSWORD
const jwt = require("jsonwebtoken"); // GENERATE SECURED TOKEN
const fs = require("fs"); // TO MANAGE STORED IMAGES


// MIDDLEWARE SIGNUP  - REGISTER USER AND HASH PASSWORD 
exports.signup = (req, res, next) => {


    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = hash;
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/avatarDefault.jpg`;

        let sqlSignup;
        let values;
        
        sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, NULL, 'user', ?, NULL, ?, NOW())";
        values = [email, firstName, lastName, password,avatarUrl];
        mysql.query(sqlSignup, values, function (err, result) {
            //error from database
            if (err) {
                //console.log(err.sqlMessage)
                return res.status(500).json(err.sqlMessage);
            }
                res.status(201).json({ message: "Utilisateur créé !" });
            });
        })
        //error from Express 
        .catch(function (err) {res.status(500).json(err)});
};
// END OF MIDDLEWARE


// MIDDLEWARE LOGIN WITH EMAIL UNIQUNESS CHECKED
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT userID, password FROM user WHERE email = ?";
//LOOK FOR USER IN DATABASE
    mysql.query(sqlFindUser, [email], function (err, result) {
        if (err) {
            return res.status(500).json(err.sqlMessage);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
//IF USER EXISTS, PASSWORD IS CHECKED
//result from MySqlQuery
        bcrypt.compare(password, result[0].password)
            .then(valid => {
//IF INCORRECT PASSWORD
                if (!valid) {
                    return res.status(401).json({ error: "Incorrect password !" });
                }
                res.status(200).json({
                    token: jwt.sign(
                        { userID: result[0].userID },
                        "RANDOM_TOKEN_SECRET",
                        { expiresIn: "24h" }
                    ),
                    userID: result[0].userID
                });
            })
            .catch((error) =>{
                //console.log(error);
                res.status(500).json(error);
            });
    });
    // console.log(`user ${email} logged in`);
};
// FIN MIDDLEWARE

// MIDDLEWARE DELETE TO DELETE AN USER
exports.delete = (req, res, next) => {
    const password = req.body.password;
    let passwordHashed;
    // TO BE CHECKED  LOCALS
    const userID = req.body.userID
    console.log(password)
    console.log(userID)

    let sqlFindUser;
    let sqlDeleteUser;

    sqlFindUser = "SELECT password, avatarUrl FROM User WHERE userID = ?";
    mysql.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        passwordHashed = result[0].password;

    bcrypt
      .compare(password, passwordHashed)
      .then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        sqlDeleteUser = "DELETE FROM User WHERE userID = ?";
        mysql.query(sqlDeleteUser, [userID], function (err, result) {
          if (err) {
            return res.status(500).json(err.message);
          }
          if (result.affectedRows == 0) {
            return res.status(400).json({ message: "Suppression échouée" });
          }
          res.status(200).json({ message: "Utilisateur supprimé !" });
        });
      })
      .catch((e) => res.status(500).json(e));
        const filename = result[0].avatarUrl.split("/images/")[1];
        if (filename !== "avatarDefault.jpg") {
            fs.unlink(`images/${filename}`, (e) => { // PICTURE DELETING
                if (e) {
                    console.log(e);
                }
            });
        }
        
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    const userID = req.query.userID;
    let userIDAsked = req.params.id;

    let sqlGetUser;

    if (userIDAsked === "yourProfile")  {
        userIDAsked = userID;
    }
    //console.log(userIDAsked)
//Substitution format for dateCreation taken form MySql convention

    sqlGetUser = `SELECT email, firstName, lastName, pseudo, bio, avatarUrl, role, DATE_FORMAT(dateCreation, 'Inscrit depuis le %e %M %Y à %kh%i') AS dateCreation,
    COUNT(CASE WHEN userID = ? then 1 else null end) AS yourProfile FROM User WHERE userID = ?`;
    mysql.query(sqlGetUser, [userID, userIDAsked], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun utilisateur ne correspond à votre requête" });
        }
        res.status(200).json(result);
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE MODIFY
exports.modify = (req, res, next) => {
    let userID = req.body.userID;
    if (!userID) {userID = req.userID}
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const bio = req.body.bio;
    const password = req.body.password;
    //console.log(req.file)
    //console.log("USERID: ", userID)

    let sqlFindUser;
    let sqlModifyUser;
    let sqlChangePassword;
    let values;

    if (req.file) { // IF THE MODIFICATION CONCERS AVATAR - WE UPDATE DIRECTLY
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            const filename = result[0].avatarUrl.split("/images/")[1];
            sqlModifyUser = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            if (filename !== "avatarDefault.jpg") {
                fs.unlink(`images/${filename}`, () => { // WE DELETE IMAGE FILE
                    mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        }
                        return res.status(200).json({ message: "Utilisateur modifé !" });
                    });
                });
            } else {
                mysql.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json({ message: "Utilisateur modifé !" });
                });
            }
        });

    } else { // IF MODIFICATION CONCERNS USER DETAILS A PASSWORD IS REQUIRED
        sqlFindUser = "SELECT password FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }

            const newPassword = req.body.newPassword;
            const passwordHashed = result[0].password;
            bcrypt.compare(password, passwordHashed)
                .then(valid => {
                   
                    

                    if (newPassword) { // TO DEFINE NEW PASSWORD 
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                sqlChangePassword = "UPDATE User SET email=?, pseudo=?, bio=?, password=? WHERE userID = ?";
                                values = [email, pseudo, bio, hash, userID];
                                mysql.query(sqlChangePassword, values, function (err, result) {
                                    if (err) {
                                        return res.status(500).json(err.message);
                                    }
                                    if (result.affectedRows == 0) {
                                        return res.status(400).json({ message: "Changement échoué !" });
                                    }
                                    res.status(200).json({ message: "Changement réussi !" });
                                });
                            })
                            .catch(e => res.status(500).json(e));

                    } else { // IF WE KEEP THE SAME PASSWORD 
                        sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=? WHERE userID = ?";
                        values = [email, pseudo, bio, userID];
                        mysql.query(sqlModifyUser, values, function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            if (result.affectedRows == 0) {
                                return res.status(400).json({ message: "Changement échoué !" });
                            }
                            res.status(200).json({ message: "Changement réussi !" });
                        });
                    }
                })
                .catch(e => res.status(500).json(e));
        });
    }
};

exports.role = (req, res, next) => {
    const userID = req.query.userID;

    sqlFindUser = "SELECT role FROM User WHERE userID = ?";
    mysql.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        return res.status(200).json(result);
    });
};

// END OF MIDDLEWARE