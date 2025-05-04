CREATE INDEX idx_enjoy_user ON enjoy(id_user);
CREATE INDEX idx_enjoy_game ON enjoy(id_game);
CREATE INDEX idx_enjoy_user_game ON enjoy(id_user, id_game);
CREATE INDEX idx_rating_game ON Rating(id_game);
CREATE INDEX idx_categorise_category ON categorise(id_category);
CREATE INDEX idx_rating_game_category ON Rating(id_game, id_category);
CREATE INDEX idx_implementation_game ON Implementation(id_game);
CREATE INDEX idx_users_username ON Users(username);
