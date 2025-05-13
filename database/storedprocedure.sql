-- storedprocedure.sql (MySQL-compatible)

DELIMITER //

-- Procedure 1: User likes or dislikes a game
CREATE PROCEDURE sp_UserLikesOrDislikesGame(
    IN input_id_user INT,
    IN input_id_game BIGINT,
    IN input_liked BOOLEAN
)
BEGIN
    -- Vérifie si une entrée existe déjà pour l'utilisateur et le jeu
    IF EXISTS (
        SELECT 1 FROM enjoy WHERE id_user = input_id_user AND id_game = input_id_game
    ) THEN
        -- Met à jour la colonne 'liked' avec la nouvelle valeur
        UPDATE enjoy
        SET liked = input_liked
        WHERE id_user = input_id_user AND id_game = input_id_game;
    ELSE
        -- Insère une nouvelle entrée avec la valeur de 'liked'
        INSERT INTO enjoy (id_game, id_user, liked)
        VALUES (input_id_game, input_id_user, input_liked);
    END IF;
END;
//

-- Procedure 2: User removes a like or dislike
CREATE PROCEDURE sp_UserRemovesReaction(
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
    WHERE E.id_user = id_user AND E.liked = TRUE;
END;
//

-- Procedure 4: Return all games disliked by a specific user
CREATE PROCEDURE sp_GetDislikedGames(
    IN id_user INT
)
BEGIN
    SELECT G.idgame, G.name, G.description, G.thumbnail
    FROM enjoy E
    JOIN Games G ON E.id_game = G.idgame
    WHERE E.id_user = id_user AND E.liked = FALSE;
END;
//

DELIMITER ;
