-- triggers.sql (MySQL-compatible)

DELIMITER //

-- Trigger 1: Increment like count when a game is liked
CREATE TRIGGER trg_GameLiked
AFTER INSERT ON enjoy
FOR EACH ROW
BEGIN
    UPDATE Games
    SET like_count = like_count + 1
    WHERE idgame = NEW.id_game;
END;
//

-- Trigger 2: Decrement like count when a like is removed
CREATE TRIGGER trg_GameUnliked
AFTER DELETE ON enjoy
FOR EACH ROW
BEGIN
    UPDATE Games
    SET like_count = like_count - 1
    WHERE idgame = OLD.id_game;
END;
//

-- Trigger 3: Automatically assign default category (e.g., Strategy = id 1) if no categorization exists
CREATE TRIGGER trg_AutoCategoriseGame
AFTER INSERT ON Games
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM categorise WHERE id_game = NEW.idgame
    ) THEN
        INSERT INTO categorise (id_game, id_category)
        VALUES (NEW.idgame, 1);
    END IF;
END;
//

DELIMITER ;
