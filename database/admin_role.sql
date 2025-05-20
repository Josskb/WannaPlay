-- Vérifiez si l'utilisateur `admin` existe déjà
SELECT User, Host FROM mysql.user WHERE User = 'admin';

-- Supprimez l'utilisateur existant (si nécessaire)
DROP USER IF EXISTS 'admin'@'localhost';

-- Create an admin user with specific privileges
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin_password';

-- Grant privileges to manage users
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Users TO 'admin'@'localhost';

-- Grant privileges to manage games
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Games TO 'admin'@'localhost';

-- Grant privileges to manage categories and relationships
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Category TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.categorise TO 'admin'@'localhost';

-- Grant privileges to manage enjoy table (likes/dislikes)
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.enjoy TO 'admin'@'localhost';

-- Grant privileges to manage expansions, designers, publishers, etc.
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Expansion TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Designer TO 'admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON board_game_db.Publisher TO 'admin'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
