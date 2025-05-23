-- views.sql (MySQL-compatible)

-- View 1: All games liked by users
CREATE VIEW UserLikedGames AS
SELECT 
    U.id_user,
    U.username,
    G.idgame,
    G.name AS game_name,
    G.description,
    G.thumbnail
FROM enjoy E
JOIN Users U ON E.id_user = U.id_user
JOIN Games G ON E.id_game = G.idgame;

-- View 2: Recommend games based on liked categories (excluding already liked ones)
CREATE VIEW RecommendedGamesByCategory AS
SELECT DISTINCT 
    U.id_user,
    G2.idgame,
    G2.name AS recommended_game,
    G2.description,
    G2.thumbnail
FROM enjoy E
JOIN categorise C1 ON E.id_game = C1.id_game
JOIN categorise C2 ON C1.id_category = C2.id_category
JOIN Games G2 ON C2.id_game = G2.idgame
JOIN Users U ON E.id_user = U.id_user
WHERE G2.idgame NOT IN (
    SELECT id_game FROM enjoy WHERE id_user = U.id_user
)
AND G2.idgame <> E.id_game;

-- View 3: Average ratings for each game
CREATE VIEW TopRatedGames AS
SELECT 
    G.idgame,
    G.name,
    AVG(R.rate) AS avg_rating,
    COUNT(R.id_rating) AS total_ratings
FROM Rating R
JOIN Games G ON R.id_game = G.idgame
GROUP BY G.idgame, G.name;

-- View 4: Collaborative filtering – other users who liked similar games
CREATE VIEW RecommendedByOtherUsers AS
SELECT 
    target.id_user AS target_user,
    g.idgame AS recommended_game_id,
    g.name AS recommended_game_name,
    g.description,
    g.thumbnail,
    COUNT(*) AS common_likes_score
FROM enjoy AS target
JOIN enjoy AS other
    ON target.id_game = other.id_game AND target.id_user <> other.id_user
JOIN enjoy AS other_likes
    ON other.id_user = other_likes.id_user
LEFT JOIN enjoy AS already_liked
    ON already_liked.id_user = target.id_user AND already_liked.id_game = other_likes.id_game
JOIN Games g ON other_likes.id_game = g.idgame
WHERE already_liked.id_game IS NULL
GROUP BY target.id_user, g.idgame, g.name, g.description, g.thumbnail;

-- View 5 : Top 5 most liked categories for a user
CREATE OR REPLACE VIEW v_top5_categories_per_user AS
SELECT 
    e.id_user,
    c.id_category,
    cat.name AS category_name,
    COUNT(*) AS like_count
FROM enjoy e
JOIN categorise c ON e.id_game = c.id_game
JOIN Category cat ON c.id_category = cat.id_category
GROUP BY e.id_user, c.id_category
ORDER BY e.id_user, like_count DESC;

-- View to list all users
CREATE OR REPLACE VIEW AdminUserList AS
SELECT id_user, username, email, birthdate
FROM Users;

-- View to list all games
CREATE OR REPLACE VIEW AdminGameList AS
SELECT idgame, name, description, yearpublished, maxplayers, playingtime, thumbnail
FROM Games;