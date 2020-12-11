-- Drops if it exists currently --
DROP DATABASE IF EXISTS gaming_underground_db;
-- Creates the database --
CREATE DATABASE gaming_underground_db;

USE gaming_underground_db;

-- table stores login information
CREATE TABLE User_login(
	id int NOT NULL AUTO_INCREMENT,
	email varchar(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL,
	PRIMARY KEY (id)
);

-- table stores user displayName and win/loss record
CREATE TABLE User_stat(
    id int NOT NULL AUTO_INCREMENT,
	login_id int NOT NULL,
    display_name varchar(255) DEFAULT "New Player",
    wins BOOLEAN DEFAULT FALSE,
	foreign key (login_id) references user_login(id) on delete cascade,
	PRIMARY KEY (id)
);

-- the list of gaming tables players can sit down at to chat or play a game
CREATE TABLE gaming_tables(
    id int NOT NULL AUTO_INCREMENT,
	game varchar(30) NOT NULL DEFAULT "Just Chatting",
    game_started BOOLEAN DEFAULT FALSE,
    user1 varchar(255),
    user2 varchar(255),
    user3 varchar(255),
    user4 varchar(255),
    user5 varchar(255),
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL,
	PRIMARY KEY (id)
);

-- stores chat log info for each gaming table
CREATE TABLE chat_log(
    id int NOT NULL AUTO_INCREMENT,
	user varchar(255) NOT NULL,
    message varchar(255) NOT NULL,
    table_id int NOT NULL,
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL,
    foreign key (table_id) references gaming_tables(id) on delete cascade,
	PRIMARY KEY (id)
);

CREATE TABLE photo(
    id int NOT NULL AUTO_INCREMENT,
	photo BLOB NOT NULL,
    user_id varchar(255) NOT NULL,
    table_id int NOT NULL,
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL,
    foreign key (table_id) references gaming_tables(id) on delete cascade,
	PRIMARY KEY (id)
);
