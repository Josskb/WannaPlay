-- indexes.sql (MySQL compatible)

-- Indexes for performance on join and filter queries

-- Optimise queries on enjoy table
CREATE INDEX idx_enjoy_user ON enjoy(id_user);
CREATE INDEX idx_enjoy_game ON enjoy(id_game);
CREATE INDEX idx_enjoy_user_game ON enjoy(id_user, id_game);

-- Optimize queries on rating by game or by game-category
CREATE INDEX idx_rating_game ON Rating(id_game);
CREATE INDEX idx_rating_game_category ON Rating(id_game, id_category);

-- Speed up categorise-based recommendations
CREATE INDEX idx_categorise_category ON categorise(id_category);

-- Improve join performance between Games and Implementation
CREATE INDEX idx_implementation_game ON Implementation(id_game);

-- Support username-based search or uniqueness
CREATE INDEX idx_users_username ON Users(username);
