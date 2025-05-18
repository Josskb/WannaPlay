-- storedprocedure.sql (MySQL-compatible)

DELIMITER //

-- Procedure 1: User likes or dislikes a game
DROP PROCEDURE IF EXISTS sp_UserLikesOrDislikesGame;
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
DROP PROCEDURE IF EXISTS sp_UserRemovesReaction;
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
DROP PROCEDURE IF EXISTS sp_GetLikedGames;
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
DROP PROCEDURE IF EXISTS sp_GetDislikedGames;
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

DELIMITER //


-- Procedure 5: Add a new category and assign games to it
DELIMITER //

DROP PROCEDURE IF EXISTS sp_CreateCategoryAndAssignGames;

CREATE PROCEDURE sp_CreateCategoryAndAssignGames(
    IN category_name VARCHAR(50),
    IN game_ids JSON
)
BEGIN
    DECLARE new_category_id INT;
    DECLARE idx INT DEFAULT 0;
    DECLARE game_count INT;
    DECLARE game_id BIGINT;

    -- Étape 1 : Vérifier si la catégorie existe déjà
    SELECT id_category INTO new_category_id
    FROM Category
    WHERE name = category_name;

    -- Étape 2 : Si elle n'existe pas, l'insérer
    IF new_category_id IS NULL THEN
        INSERT INTO Category (name)
        VALUES (category_name);

        SET new_category_id = LAST_INSERT_ID();
    END IF;

    -- Étape 3 : Nombre d'éléments dans le tableau JSON
    SET game_count = JSON_LENGTH(game_ids);

    -- Étape 4 : Pour chaque ID de jeu, insérer dans la table de liaison
    WHILE idx < game_count DO
        SET game_id = CAST(JSON_UNQUOTE(JSON_EXTRACT(game_ids, CONCAT('$[', idx, ']'))) AS UNSIGNED);

        INSERT IGNORE INTO categorise (id_game, id_category)
        VALUES (game_id, new_category_id);

        SET idx = idx + 1;
    END WHILE;
END;
//

-- Procedure 6: Get games by category
DROP PROCEDURE IF EXISTS sp_GetGamesByCategory;

CREATE PROCEDURE sp_GetGamesByCategory(
    IN category_name VARCHAR(50)
)
BEGIN
    SELECT G.idgame, G.name, G.description, G.thumbnail
    FROM Games G
    JOIN categorise C ON G.idgame = C.id_game
    JOIN Category Cat ON C.id_category = Cat.id_category
    WHERE Cat.name = category_name;
END;
//

DELIMITER ;
