
//Modules
const mysql = require('../connection').connection
const fs = require("fs"); // Permet de gérer les fichiers stockés


function getNewestFile(files, path) {
    var out = [];
    files.forEach(function(file) {
        var stats = fs.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}

//Middleware getAllPosts pour récupérer tout les posts
exports.getAllPosts = (req, res, next) => {
    const userID = req.query.userID;

    let sqlGetPosts;

    sqlGetPosts = `SELECT Post.postID, post.userID, legend, gifUrl, DATE_FORMAT(post.dateCreation, '%e %M %Y at %kh%i') AS dateCreation, firstName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp,
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID WHERE post.postIDComment IS NULL GROUP BY Post.postID ORDER BY post.postID DESC`;
    mysql.query(sqlGetPosts, [userID, userID, userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({});
        }
        res.status(200).json(result);
    });
};


//Middleware getOnePost pour récupérer un post
exports.getOnePost = (req, res, next) => {
    const userID = req.query.userID;
    const postID = req.params.id;

    let sqlGetPost;

    sqlGetPost = `SELECT Post.postID, post.userID, legend, body, gifUrl, DATE_FORMAT(post.dateCreation, '%e %M %Y at %kh%i') AS dateCreation, firstName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp,
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID WHERE Post.postID = ? OR Post.postIDComment = ? GROUP BY Post.postID ORDER BY post.postID DESC`;
    mysql.query(sqlGetPost, [userID, userID, userID, postID, postID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun post à afficher !" });
        }
        res.status(200).json(result);
    });
};

//Middleware createPost pour créer un post
exports.createPost = (req, res, next) => {
    const userID = req.body.userID;
    const legend = req.body.legend;
    fs.readdir('../backend/images', function(err, files) {
        if (err) { return console.error(err); }
        var file = getNewestFile(files, '../backend/images');
        const gifUrl = `${req.protocol}://${req.get("host")}/images/${file}`;
        let sqlCreatePost;
        let values;
        sqlCreatePost = "INSERT INTO post VALUES (NULL, ?, ?, ?, NULL, NULL, NOW())";
        values = [userID, legend, gifUrl];
        mysql.query(sqlCreatePost, values, function (err, result) {
            if (err) {
                console.log(err.sqlMessage)
                return res.status(500).json(err.sqlMessage);
            }
            res.status(201).json({ message: "Post créé !" });
        });
    })

};

exports.modifyPost = (req, res, next) => {
    const postID = req.params.id;
    const userID = req.body.userID;
    const legend = req.body.legend;
  


    
    let sqlModifyPost;
    sqlModifyPost = "UPDATE post SET legend =? WHERE postID = ? AND userID = ?"
    mysql.query(sqlSelectPost, [legend, postID, userID], function (err, result) {
        if (err){
            return res.status(500).json(err.message);  
        }
        res.status(200).json({ message: "Post modifié !" });
    });
};


// MIDDLEWARE DELETEPOST pour supprimer les messages
exports.deletePost = (req, res, next) => {
    const postID = req.params.id;
    const userID = req.query.userID;
  

    let sqlDeletePost;
    let sqlSelectPost;

    sqlSelectPost = "SELECT gifUrl FROM Post WHERE postID = ?";
    mysql.query(sqlSelectPost, [postID], function (err, result) {
        if (result > 0) {
            const filename = result[0].gifUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                sqlDeletePost = "DELETE FROM Post WHERE userID = ? AND postID = ?";
                mysql.query(sqlDeletePost, [userID, postID], function (err, result) {
                    if (err) {
                        console.log(err.message)
                        return res.status(500).json(err.message);
                    }
                    res.status(200).json({ message: "Post deleted !" });
                });
            });
        } else {
            sqlDeletePost = "DELETE FROM Post WHERE userID = ? AND postID = ?";
            mysql.query(sqlDeletePost, [userID, postID], function (err, result) {
                if (err) {
                    console.log(err.message)
                    return res.status(500).json(err.message);
                }
                res.status(200).json({ message: "Post deleted !" });
            });
        }
        if (err) {
            console.log(err.message)
            return res.status(500).json(err.message);
        }


    });
};

exports.createComment = (req, res, next) => {
    const postID = req.params.id;
    const userID = req.body.userID;
    const body = req.body.content;
    let sqlCreateComment;
    let values;

    sqlCreateComment = "INSERT INTO post VALUES (NULL, ?, NULL, NULL, ?, ?, NOW())";
    values = [userID, postID, body];
    mysql.query(sqlCreateComment, values, function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        res.status(201).json({ message: "Commentaire crée !" });
    });
};

exports.getComments = (req, res, next) => {
    const userID = req.query.userID
    const postID = req.params.id
   
    let sqlGetComments = `SELECT post.postID, post.userID, postIdComment, body, DATE_FORMAT(post.dateCreation, '%e %M %Y at %kh%i') AS dateCreation, firstName, lastName, pseudo, avatarUrl,
    COUNT(CASE WHEN reaction.reaction = 1 then 1 else null end) AS countUp,
    COUNT(CASE WHEN reaction.reaction = -1 then 1 else null end) AS countDown,
    SUM(CASE WHEN reaction.userID = ? AND reaction.reaction = 1 then 1 WHEN reaction.userID = ? AND reaction.reaction = -1 then -1 else 0 end) AS yourReaction,
    COUNT(CASE WHEN Post.userID = ? then 1 else null end) AS yourPost
    FROM Post LEFT OUTER JOIN User ON Post.userID = User.userID LEFT OUTER JOIN Reaction ON Post.postID = Reaction.postID 
    WHERE postIdComment = ? GROUP BY Post.postID ORDER BY post.postID DESC;`
    mysql.query(sqlGetComments, [userID, userID, userID, postID], function(err, result) {
        if (err){
            console.log(err.sqlMessage)
            return res.status(500).json(err.message)
        }
        
        res.status(201).json(result)
    })

}

exports.reactPost = (req, res, next) => {
    const userID = req.body.userID;
    const reaction = req.body.reaction;
    const postID = req.params.id;

    const helpQuery = `SELECT COUNT(1) as count FROM reaction WHERE reaction.userId = ? AND reaction.postId = ? 
                        GROUP BY reaction.userId, reaction.postId;`
    mysql.query(helpQuery, [userID, postID], function(err, result) {
        if (err){
            console.log(err.sqlMessage)
            return res.status(500).json(err.message)
        }
        
        
        let sqlReaction = `INSERT INTO reaction VALUES (?, ?, ?, NOW())`
        let values = [userID, postID, reaction, reaction]
    
        if (result[0]){
            sqlReaction = `UPDATE reaction SET reaction = ? WHERE reaction.userId = ? AND reaction.postId = ?`
            values = [reaction, userID, postID]
        }

       

        mysql.query(sqlReaction, values, function (err, result) {
            if (err) {
                console.log(err.message)
                return res.status(500).json(err.message);
            }
            res.status(201).json({ message: "Réaction mise à jour !" });
        });
    })

    
    
    
};

// FIN MIDDLEWARE