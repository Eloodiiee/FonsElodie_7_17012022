SET NAMES utf8;

DROP DATABASE IF EXISTS Groupomania;

CREATE DATABASE Groupomania CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'adminGroupomania' IDENTIFIED BY 'adminGroupomania';
GRANT ALL
ON Groupomania.*
TO 'adminGroupomania';

CREATE TABLE `user` (

userId SMALLINT(5) NOT NULL AUTO_INCREMENT PRIMARY KEY,

email VARCHAR(255) NOT NULL UNIQUE,

firstName VARCHAR(100),

lastName VARCHAR(100),

pseudo VARCHAR(100),

`role` VARCHAR(100) default 'user',

password VARCHAR(100),

bio VARCHAR(300) NULL,

avatarUrl VARCHAR(150),

dateCreation DATETIME

);


CREATE TABLE post (

postId MEDIUMINT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,

userId SMALLINT(5) NOT NULL,

legend VARCHAR(255),

gifUrl VARCHAR(255),

postIdComment MEDIUMINT(10),

body TEXT,

dateCreation DATETIME

);

CREATE TABLE reaction (

userId SMALLINT(5),

postId MEDIUMINT(10),

reaction SMALLINT(4),

dateCreation DATETIME

);
ALTER TABLE Post

ADD CONSTRAINT fk_post_userId FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
ADD CONSTRAINT fk_commentId FOREIGN KEY (postIdComment) REFERENCES Post(postId) ON DELETE CASCADE;

ALTER TABLE Reaction
ADD CONSTRAINT fk_reaction_userId FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
ADD CONSTRAINT fk_postId FOREIGN KEY (postId) REFERENCES Post(postId) ON DELETE CASCADE;