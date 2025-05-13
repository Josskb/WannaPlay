-- function.sql (MySQL-compatible)

-- Function 1: Count how many games a user liked
DELIMITER //
CREATE FUNCTION fn_UserLikesCount (input_id_user INT)
RETURNS JSON
DETERMINISTIC
BEGIN
    DECLARE total_swiped INT DEFAULT 0;
    DECLARE total_liked INT DEFAULT 0;
    DECLARE total_disliked INT DEFAULT 0;

    -- Nombre total de jeux swipés
    SELECT COUNT(*) INTO total_swiped
    FROM enjoy
    WHERE id_user = input_id_user;

    -- Nombre de jeux likés
    SELECT COUNT(*) INTO total_liked
    FROM enjoy
    WHERE id_user = input_id_user AND liked = TRUE;

    -- Nombre de jeux dislikés
    SELECT COUNT(*) INTO total_disliked
    FROM enjoy
    WHERE id_user = input_id_user AND liked = FALSE;

    -- Retourne les résultats sous forme de JSON
    RETURN JSON_OBJECT(
        'total_swiped', total_swiped,
        'total_liked', total_liked,
        'total_disliked', total_disliked
    );
END;
//
DELIMITER ;

-- Function 2: Return the ID of the most liked game
DELIMITER //
CREATE FUNCTION fn_MostLikedGame ()
RETURNS BIGINT
DETERMINISTIC
BEGIN
    DECLARE top_game BIGINT DEFAULT NULL;

    SELECT idgame INTO top_game
    FROM Games
    ORDER BY like_count DESC
    LIMIT 1;

    RETURN top_game;
END;
//
DELIMITER ;

-- Function 3: Recommend a random game from user's favorite category
DELIMITER //

CREATE FUNCTION fn_RecommendRandomGame (id_user INT)
RETURNS BIGINT
DETERMINISTIC
BEGIN
    DECLARE chosen_category INT DEFAULT NULL;
    DECLARE recommended_game BIGINT DEFAULT NULL;

    -- 1. Randomly pick one of the user's top 5 liked categories from the view
    SELECT id_category INTO chosen_category
    FROM (
        SELECT id_category
        FROM v_top5_categories_per_user
        WHERE id_user = id_user
        ORDER BY like_count DESC
        LIMIT 5
    ) AS top5
    ORDER BY RAND()
    LIMIT 1;

    -- 2. If the user has no liked categories, pick a random one
    IF chosen_category IS NULL THEN
        SELECT id_category INTO chosen_category
        FROM Category
        ORDER BY RAND()
        LIMIT 1;
    END IF;

    -- 3. Pick a random game from the chosen category that the user hasn’t liked yet
    SELECT c.id_game INTO recommended_game
    FROM categorise c
    WHERE c.id_category = chosen_category
      AND c.id_game NOT IN (
          SELECT id_game FROM enjoy WHERE id_user = id_user
      )
    ORDER BY RAND()
    LIMIT 1;

    -- 4. If all games in that category are already liked or none available, pick any random game
    IF recommended_game IS NULL THEN
        SELECT idgame INTO recommended_game
        FROM Games
        ORDER BY RAND()
        LIMIT 1;
    END IF;

    RETURN recommended_game;
END;
//
DELIMITER ;