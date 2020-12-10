INSERT INTO User_login (email, password, createdAt, updatedAt)
VALUES ("Alice@aliceMail.com", "password", "2020-12-21", "2020-12-21"), ("Bob@aol.com", "password", "2020-12-21", "2020-12-21");

INSERT INTO User_stat (login_id, display_name, wins, losses)
VALUES (1, "Alice", 10, 3), (2, "Bob", 5, 10);

INSERT INTO gaming_tables (game, game_started, user1, createdAt, updatedAt)
VALUES ("Just Chatting", false, 1,"2020-12-21", "2020-12-21"), ("Black Jack", true, 2,"2020-12-21", "2020-12-21");

INSERT INTO chat_log (user, message, table_id, createdAt, updatedAt)
VALUES ("Alice", "Hello World", 1,"2020-12-21", "2020-12-21"), ("Bob", "Hello everyone", 2, "2020-12-21", "2020-12-21"), ("Bob", "How's it going?", 2,"2020-12-21", "2020-12-21");