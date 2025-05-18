DROP PROCEDURE IF EXISTS sp_AddGameWithDetails;

DELIMITER //

CREATE PROCEDURE sp_AddGameWithDetails(
    IN game_name TEXT,
    IN description TEXT,
    IN year_published INT,
    IN max_players INT,
    IN playing_time INT,
    IN thumbnail TEXT,
    IN categories JSON,
    IN designers JSON
)
BEGIN
    DECLARE new_game_id BIGINT;

    -- Start the transaction
    START TRANSACTION;

    -- Insert the game into the Games table
    INSERT INTO Games (name, description, yearpublished, maxplayers, playingtime, thumbnail)
    VALUES (game_name, description, year_published, max_players, playing_time, thumbnail);

    -- Get the ID of the newly inserted game
    SET new_game_id = LAST_INSERT_ID();

    -- Insert categories into the categorise table
    IF JSON_LENGTH(categories) > 0 THEN
        INSERT INTO categorise (id_game, id_category)
        SELECT new_game_id, 
               IFNULL(
                   (SELECT id_category FROM Category WHERE id_category = JSON_UNQUOTE(JSON_EXTRACT(categories, CONCAT('$[', idx, ']')))),
                   1 -- Utilisez la catégorie par défaut si l'ID de catégorie n'existe pas
               )
        FROM (
            SELECT 0 AS idx UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        ) AS indices
        WHERE idx < JSON_LENGTH(categories);
    ELSE
        -- Si aucune catégorie n'est fournie, insérez la catégorie par défaut
        INSERT INTO categorise (id_game, id_category)
        VALUES (new_game_id, 1);
    END IF;

    -- Insert designers into the design table
    IF JSON_LENGTH(designers) > 0 THEN
        INSERT INTO design (id_game, id_designer)
        SELECT new_game_id, CAST(JSON_UNQUOTE(JSON_EXTRACT(designers, CONCAT('$[', idx, ']'))) AS UNSIGNED)
        FROM (
            SELECT 0 AS idx UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        ) AS indices
        WHERE idx < JSON_LENGTH(designers);
    END IF;

    -- Commit the transaction
    COMMIT;
END;
//

DELIMITER ;
