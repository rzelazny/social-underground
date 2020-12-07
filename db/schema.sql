-- Drops the blogger if it exists currently --
DROP DATABASE IF EXISTS gaming_underground_db;
-- Creates the "blogger" database --
CREATE DATABASE gaming_underground_db;

USE gaming_underground_db;

CREATE TABLE user_login(
	id int NOT NULL AUTO_INCREMENT,
	login varchar(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE user_stats(
    id int NOT NULL AUTO_INCREMENT,
	login_id int NOT NULL,
    wins int DEFAULT 0,
    losses int DEFAULT 0,
	foreign key (login_id) references user_login(id) on delete cascade,
	PRIMARY KEY (id)
);

CREATE TABLE gaming_tables(
    id int NOT NULL AUTO_INCREMENT,
	game varchar(30) NOT NULL DEFAULT 'Just Chatting',
    game_started BOOLEAN DEFAULT FALSE,
    user1 varchar(255),
    user2 varchar(255),
    user3 varchar(255),
    user4 varchar(255),
    user5 varchar(255),
	PRIMARY KEY (id)
);

CREATE TABLE chat_log(
    id int NOT NULL AUTO_INCREMENT,
	user varchar(255) NOT NULL,
    message varchar(255) NOT NULL,
    table_id int NOT NULL,
    foreign key (table_id) references gaming_tables(id) on delete cascade,
	PRIMARY KEY (id)
);