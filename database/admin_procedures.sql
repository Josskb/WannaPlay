DELIMITER //

-- Procedure to add a new user
CREATE PROCEDURE sp_AddUser(
    IN username VARCHAR(50),
    IN email VARCHAR(50),
    IN password VARCHAR(50)
)
BEGIN
    INSERT INTO Users (username, email, password)
    VALUES (username, email, password);
END;
//

-- Procedure to update a user's information
CREATE PROCEDURE sp_UpdateUser(
    IN user_id INT,
    IN new_username VARCHAR(50),
    IN new_email VARCHAR(50),
    IN new_password VARCHAR(50)
)
BEGIN
    UPDATE Users
    SET username = new_username, email = new_email, password = new_password
    WHERE id_user = user_id;
END;
//

-- Procedure to delete a user
CREATE PROCEDURE sp_DeleteUser(
    IN user_id INT
)
BEGIN
    DELETE FROM Users WHERE id_user = user_id;
END;
//

-- Procedure to add a new game
CREATE PROCEDURE sp_AddGame(
    IN game_name TEXT,
    IN description TEXT,
    IN year_published INT,
    IN max_players INT,
    IN playing_time INT,
    IN thumbnail TEXT
)
BEGIN
    INSERT INTO Games (name, description, yearpublished, maxplayers, playingtime, thumbnail)
    VALUES (game_name, description, year_published, max_players, playing_time, thumbnail);
END;
//

-- Procedure to update a game's description
CREATE PROCEDURE sp_UpdateGameDescription(
    IN game_id BIGINT,
    IN new_description TEXT
)
BEGIN
    UPDATE Games
    SET description = new_description
    WHERE idgame = game_id;
END;
//

-- Procedure to delete a game
CREATE PROCEDURE sp_DeleteGame(
    IN game_id BIGINT
)
BEGIN
    DELETE FROM Games WHERE idgame = game_id;
END;
//

DELIMITER ;
