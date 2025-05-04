
-- triggers.sql

-- Trigger 1: Increment like count when a game is liked
CREATE TRIGGER trg_GameLiked
ON enjoy
AFTER INSERT
AS
BEGIN
    UPDATE Games
    SET like_count = like_count + 1
    WHERE idgame IN (SELECT id_game FROM INSERTED);
END;

-- Trigger 2: Decrement like count when a like is removed
CREATE TRIGGER trg_GameUnliked
ON enjoy
AFTER DELETE
AS
BEGIN
    UPDATE Games
    SET like_count = like_count - 1
    WHERE idgame IN (SELECT id_game FROM DELETED);
END;

-- Trigger 3: Automatically assign default category if none exists (hypothetical)
CREATE TRIGGER trg_AutoCategoriseGame
ON Games
AFTER INSERT
AS
BEGIN
    INSERT INTO categorise (id_game, id_category)
    SELECT idgame, 1 FROM INSERTED
    WHERE NOT EXISTS (
        SELECT 1 FROM categorise WHERE categorise.id_game = INSERTED.idgame
    );
END;
