-- function.sql (MySQL-compatible)

-- Function 1: Count how many games a user liked
DELIMITER //
CREATE FUNCTION fn_UserLikesCount (id_user INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE likes_count INT DEFAULT 0;

    SELECT COUNT(*) INTO likes_count
    FROM enjoy
    WHERE id_user = id_user;

    RETURN likes_count;
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
    DECLARE top_category INT DEFAULT NULL;
    DECLARE recommended_game BIGINT DEFAULT NULL;

    -- Get most liked category
    SELECT c.id_category INTO top_category
    FROM enjoy e
    JOIN categorise c ON e.id_game = c.id_game
    WHERE e.id_user = id_user
    GROUP BY c.id_category
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- Pick a random game from that category the user hasn’t liked yet
    SELECT c.id_game INTO recommended_game
    FROM categorise c
    WHERE c.id_category = top_category
    AND c.id_game NOT IN (
        SELECT id_game FROM enjoy WHERE id_user = id_user
    )
    ORDER BY RAND()
    LIMIT 1;

    RETURN recommended_game;
END;
//
DELIMITER ;
