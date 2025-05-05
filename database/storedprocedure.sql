-- storedprocedure.sql (MySQL-compatible)

DELIMITER //

-- Procedure 1: User likes a game (swipe right)
CREATE PROCEDURE sp_UserLikesGame(
    IN id_user INT,
    IN id_game BIGINT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM enjoy WHERE id_user = id_user AND id_game = id_game
    ) THEN
        INSERT INTO enjoy (id_game, id_user)
        VALUES (id_game, id_user);
    END IF;
END;
//

-- Procedure 2: User removes a like
CREATE PROCEDURE sp_UserUnlikesGame(
    IN id_user INT,
    IN id_game BIGINT
)
BEGIN
    DELETE FROM enjoy
    WHERE id_user = id_user AND id_game = id_game;
END;
//

-- Procedure 3: Return all games liked by a specific user
CREATE PROCEDURE sp_GetLikedGames(
    IN id_user INT
)
BEGIN
    SELECT G.idgame, G.name, G.description, G.thumbnail
    FROM enjoy E
    JOIN Games G ON E.id_game = G.idgame
    WHERE E.id_user = id_user;
END;
//

DELIMITER ;
