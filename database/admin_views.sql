-- View to list all users
CREATE OR REPLACE VIEW AdminUserList AS
SELECT id_user, username, email, birthdate
FROM Users;

-- View to list all games
CREATE OR REPLACE VIEW AdminGameList AS
SELECT idgame, name, description, yearpublished, maxplayers, playingtime, thumbnail
FROM Games;
