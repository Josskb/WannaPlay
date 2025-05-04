
-- function.sql

-- Function 1: Count how many games a user liked
CREATE FUNCTION fn_UserLikesCount (@id_user INT)
RETURNS INT
AS
BEGIN
    DECLARE @count INT;

    SELECT @count = COUNT(*) FROM enjoy WHERE id_user = @id_user;

    RETURN @count;
END;

-- Function 2: Return most liked game ID
CREATE FUNCTION fn_MostLikedGame ()
RETURNS BIGINT
AS
BEGIN
    DECLARE @id BIGINT;

    SELECT TOP 1 @id = idgame
    FROM Games
    ORDER BY like_count DESC;

    RETURN @id;
END;

-- Function 3: Recommend a random game from user's favorite category
CREATE FUNCTION fn_RecommendRandomGame (@id_user INT)
RETURNS BIGINT
AS
BEGIN
    DECLARE @topCategory INT;
    DECLARE @recommendedGame BIGINT;

    SELECT TOP 1 @topCategory = c.id_category
    FROM enjoy e
    JOIN categorise c ON e.id_game = c.id_game
    WHERE e.id_user = @id_user
    GROUP BY c.id_category
    ORDER BY COUNT(*) DESC;

    SELECT TOP 1 @recommendedGame = c.id_game
    FROM categorise c
    WHERE c.id_category = @topCategory
    AND c.id_game NOT IN (
        SELECT id_game FROM enjoy WHERE id_user = @id_user
    )
    ORDER BY NEWID();

    RETURN @recommendedGame;
END;
