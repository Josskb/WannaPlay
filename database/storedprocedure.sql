
-- storedprocedure.sql

-- Procedure 1: User likes a game (swipe right)
CREATE PROCEDURE sp_UserLikesGame
    @id_user INT,
    @id_game BIGINT
AS
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM enjoy WHERE id_user = @id_user AND id_game = @id_game
    )
    BEGIN
        INSERT INTO enjoy (id_game, id_user)
        VALUES (@id_game, @id_user);
    END
END;

-- Procedure 2: User removes a like
CREATE PROCEDURE sp_UserUnlikesGame
    @id_user INT,
    @id_game BIGINT
AS
BEGIN
    DELETE FROM enjoy
    WHERE id_user = @id_user AND id_game = @id_game;
END;

-- Procedure 3: Return all games liked by a specific user
CREATE PROCEDURE sp_GetLikedGames
    @id_user INT
AS
BEGIN
    SELECT G.idgame, G.name, G.description, G.thumbnail
    FROM enjoy E
    JOIN Games G ON E.id_game = G.idgame
    WHERE E.id_user = @id_user;
END;
