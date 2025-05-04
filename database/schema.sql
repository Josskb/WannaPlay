-- schema.sql

CREATE DATABASE IF NOT EXISTS board_game_db;
GO
USE board_game_db;
GO

CREATE TABLE Games (
    idgame BIGINT IDENTITY(1,1) PRIMARY KEY,
    num INT,
    name VARCHAR(50),
    description VARCHAR(255),
    yearpublished INT,
    maxplayers INT,
    playingtime INT,
    minplaytime INT,
    maxplaytime INT,
    minage INT,
    owned INT,
    thumbnail VARCHAR(255)
);

CREATE TABLE Users (
    id_user INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50),
    birthdate DATE,
    firstname VARCHAR(50),
    lastname VARCHAR(50)
);

CREATE TABLE Category (
    id_category INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Expansion (
    id_expansion INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50),
    id_game BIGINT,
    FOREIGN KEY (id_game) REFERENCES Games(idgame)
);

CREATE TABLE Designer (
    id_designer INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Publisher (
    id_publisher INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Implementation (
    id_implementation INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50),
    id_game BIGINT,
    FOREIGN KEY (id_game) REFERENCES Games(idgame)
);

CREATE TABLE Family (
    id_family INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE Rating (
    id_rating INT IDENTITY(1,1) PRIMARY KEY,
    rate DECIMAL(15,2),
    id_category INT,
    id_implementation INT,
    id_game BIGINT,
    id_user INT,
    FOREIGN KEY (id_category) REFERENCES Category(id_category),
    FOREIGN KEY (id_implementation) REFERENCES Implementation(id_implementation),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);

CREATE TABLE enjoy (
    id_game BIGINT,
    id_user INT,
    PRIMARY KEY (id_game, id_user),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_user) REFERENCES Users(id_user)
);

CREATE TABLE categorise (
    id_game BIGINT,
    id_category INT,
    PRIMARY KEY (id_game, id_category),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_category) REFERENCES Category(id_category)
);

CREATE TABLE design (
    id_game BIGINT,
    id_designer INT,
    PRIMARY KEY (id_game, id_designer),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_designer) REFERENCES Designer(id_designer)
);

CREATE TABLE publish (
    id_game BIGINT,
    id_publisher INT,
    PRIMARY KEY (id_game, id_publisher),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_publisher) REFERENCES Publisher(id_publisher)
);

CREATE TABLE own (
    id_game BIGINT,
    id_family INT,
    PRIMARY KEY (id_game, id_family),
    FOREIGN KEY (id_game) REFERENCES Games(idgame),
    FOREIGN KEY (id_family) REFERENCES Family(id_family)
);
