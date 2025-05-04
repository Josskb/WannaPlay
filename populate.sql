
-- populate.sql

-- Insert into Games
INSERT INTO Games (num, name, description, yearpublished, maxplayers, playingtime, minplaytime, maxplaytime, minage, owned, thumbnail) VALUES
(1, 'Catan', 'Trade, build, and settle on the island of Catan.', 1995, 4, 90, 60, 90, 10, 150000, 'catan.jpg'),
(2, 'Carcassonne', 'Build a medieval landscape with tiles.', 2000, 5, 45, 30, 45, 7, 120000, 'carcassonne.jpg'),
(3, 'Ticket to Ride', 'Collect cards and build railroads across America.', 2004, 5, 60, 30, 60, 8, 200000, 'ticket_to_ride.jpg'),
(4, 'Chess', 'Classic game of strategy and tactics.', 1850, 2, 60, 30, 90, 6, 300000, 'chess.jpg'),
(5, '7 Wonders', 'Draft cards to build your civilization.', 2010, 7, 30, 30, 40, 10, 80000, '7wonders.jpg');

-- Insert into Users
INSERT INTO Users (username, email, birthdate, firstname, lastname) VALUES
('alice_gamer', 'alice@example.com', '1995-06-15', 'Alice', 'Smith'),
('bob_builder', 'bob@example.com', '1988-11-22', 'Bob', 'Johnson'),
('charlie_player', 'charlie@example.com', '2000-03-10', 'Charlie', 'Williams'),
('diana_queen', 'diana@example.com', '1992-08-30', 'Diana', 'Brown'),
('eve_city', 'eve@example.com', '1985-01-05', 'Eve', 'Davis');

-- Insert into Category
INSERT INTO Category (name) VALUES
('Strategy'),
('Family'),
('Abstract'),
('Adventure'),
('Tile Placement');

-- Insert into Expansion
INSERT INTO Expansion (name, id_game) VALUES
('Catan: Seafarers', 1),
('Carcassonne: Inns & Cathedrals', 2),
('Ticket to Ride: Europe', 3);

-- Insert into Designer
INSERT INTO Designer (name) VALUES
('Klaus Teuber'),
('Klaus-Jürgen Wrede'),
('Alan R. Moon'),
('Unknown'),
('Antoine Bauza');

-- Insert into Publisher
INSERT INTO Publisher (name) VALUES
('Kosmos'),
('Hans im Glück'),
('Days of Wonder'),
('Traditional'),
('Repos Production');

-- Insert into Implementation
INSERT INTO Implementation (name, id_game) VALUES
('Catan Digital Edition', 1),
('Carcassonne App', 2),
('Ticket to Ride App', 3),
('Chess.com', 4),
('7 Wonders Online', 5);

-- Insert into Family
INSERT INTO Family (name) VALUES
('Island Games'),
('Medieval Games'),
('Train Games'),
('Classic Games'),
('Card Drafting Games');

-- Insert into Rating
INSERT INTO Rating (rate, id_category, id_implementation, id_game, id_user) VALUES
(8.5, 1, 1, 1, 1),
(9.0, 2, 2, 2, 2),
(8.8, 2, 3, 3, 3),
(9.5, 3, 4, 4, 4),
(8.2, 1, 5, 5, 5);

-- Insert into enjoy
INSERT INTO enjoy (id_game, id_user) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 3),
(2, 4);

-- Insert into categorise
INSERT INTO categorise (id_game, id_category) VALUES
(1, 1),
(2, 5),
(3, 4),
(4, 3),
(5, 1),
(5, 2);

-- Insert into design
INSERT INTO design (id_game, id_designer) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert into publish
INSERT INTO publish (id_game, id_publisher) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert into own
INSERT INTO own (id_game, id_family) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);
