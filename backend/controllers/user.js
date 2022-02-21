//Modules
const mysql = require('../connection.js').connection //Connexion à la base de données
const bcrypt = require('bcrypt'); //Permet de chiffrer les mots de passe
const jwt = require("jsonwebtoken"); //Permet de générer des tokens sécurisés
const fs = require("fs"); //Pour gérer les fichiers stockés


//Middleware signup pour inscrire un utilisateur et hasher son mot de passe
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
            //Erreur venant de la base de données
            if (err) {
                return res.status(500).json(err.sqlMessage);
            }
                res.status(201).json({ message: "Utilisateur créé !" });
            });
        })
        //Erreur venant d'express
        .catch(function (err) {res.status(500).json(err)});
};


//Middleware login pour permettre à un utilisateur de se connecter
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT userID, password FROM user WHERE email = ?";
//Recherche d'un utilisateur dans la base de données
    mysql.query(sqlFindUser, [email], function (err, result) {
        if (err) {
            return res.status(500).json(err.sqlMessage);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
//Si l'utilisateur existe, on vérifie le mot de passe
        bcrypt.compare(password, result[0].password)
            .then(valid => {
//Et si le mot de passe est incorrect on envoie l'erreur
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
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
                res.status(500).json(error);
            });
    });
};

//Middleware delete pour supprimer un utilisateur
exports.delete = (req, res, next) => {
    const password = req.body.password;
    let passwordHashed;
    const userID = req.body.userID

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
            fs.unlink(`images/${filename}`, (e) => { //Suppression de l'image de profil
                if (e) {
                    console.log(e);
                }
            });
        }
        
    });
};

//Middleware de données du profil utilisateur
exports.profile = (req, res, next) => {
    const userID = req.query.userID;
    let userIDAsked = req.params.id;

    let sqlGetUser;

    if (userIDAsked === "yourProfile")  {
        userIDAsked = userID;
    }

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
//Middleware modify pour pouvoir changer ses informations de compte
exports.modify = (req, res, next) => {
    let userID = req.body.userID;
    if (!userID) {userID = req.userID}
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const bio = req.body.bio;
    const password = req.body.password;

    let sqlFindUser;
    let sqlModifyUser;
    let sqlChangePassword;
    let values;

    if (req.file) { //Si seulement l'avatar change, il est directement mis à jour
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        mysql.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            const filename = result[0].avatarUrl.split("/images/")[1];
            sqlModifyUser = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            if (filename !== "avatarDefault.jpg") {
                fs.unlink(`images/${filename}`, () => { //On supprime l'image
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

    } else { //Si la modification concerne une information utilisateur, le mot de passe est demandé
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
                   
                    

                    if (newPassword) { //Pour changer de mot de passe
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

                    } else { //Si on garde le même mot de passe 
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
//Middleware role permettant de savoir si c'est un administrateur ou un simple utilisateur
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
