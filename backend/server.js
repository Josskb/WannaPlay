const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users');
    res.status(200).json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// Like or dislike a game
app.post('/react-game', async (req, res) => {
  const { id_user, id_game, liked } = req.body;

  console.log('Reacting to game:', { id_user, id_game, liked }); // Log pour déboguer

  if (id_user == null || id_game == null || liked == null) {
    return res.status(400).json({ message: 'User ID, Game ID, and reaction (liked) are required.' });
  }

  try {
    // Vérifie si l'utilisateur existe
    const [userRows] = await db.promise().query('SELECT 1 FROM users WHERE id_user = ?', [id_user]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Vérifie si le jeu existe
    const [gameRows] = await db.promise().query('SELECT 1 FROM Games WHERE idgame = ?', [id_game]);
    if (gameRows.length === 0) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    // Appelle la procédure stockée pour liker ou disliker un jeu
    await db.promise().query('CALL sp_UserLikesOrDislikesGame(?, ?, ?)', [id_user, id_game, liked]);
    res.status(200).json({ message: liked ? 'Game liked successfully.' : 'Game disliked successfully.' });
  } catch (error) {
    console.error('Error reacting to game:', error); // Log l'erreur pour déboguer
    res.status(500).json({ message: 'Failed to react to game.' });
  }
});

// Get liked games for a user
app.get('/liked-games/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await db.promise().query('CALL sp_GetLikedGames(?)', [id_user]); // Use stored procedure
    res.status(200).json({ games: rows[0] }); // Return the first result set
  } catch (error) {
    console.error('Error fetching liked games:', error);
    res.status(500).json({ message: 'Failed to fetch liked games.' });
  }
});

// Get disliked games for a user
app.get('/disliked-games/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await db.promise().query('CALL sp_GetDislikedGames(?)', [id_user]); // Use stored procedure
    res.status(200).json({ games: rows[0] }); // Return the first result set
  } catch (error) {
    console.error('Error fetching disliked games:', error);
    res.status(500).json({ message: 'Failed to fetch disliked games.' });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;
  if (!username || !email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const [existing] = await db.promise().query(
      'SELECT id_user FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    // Insert the new user
    const [result] = await db.promise().query(
      'INSERT INTO users (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, firstname, lastname]
    );

    // Ensure the user starts with no liked or disliked games
    const newUserId = result.insertId;
    await db.promise().query('DELETE FROM enjoy WHERE id_user = ?', [newUserId]);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to login.' });
  }
});

// Recommend a game
app.get('/recommendation/:id_user', async (req, res) => {
  const { id_user } = req.params;

  if (!id_user) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT fn_RecommendRandomGame(?) AS recommended_game',
      [id_user]
    );

    const recommendedGameId = rows[0]?.recommended_game;

    if (!recommendedGameId) {
      return res.status(404).json({ message: 'No recommendation found for this user.' });
    }

    res.status(200).json({ recommended_game_id: recommendedGameId });
  } catch (error) {
    console.error('Error fetching game recommendation:', error);
    res.status(500).json({ message: 'Failed to fetch game recommendation.' });
  }
});

// Get game details
app.get('/game/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Game ID is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT idgame, name, description, thumbnail FROM Games WHERE idgame = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    res.status(200).json({ game: rows[0] });
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Failed to fetch game details.' });
  }
});

// Get swipe statistics for a user
app.get('/user-swipe-stats/:id_user', async (req, res) => {
  const { id_user } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT fn_UserLikesCount(?) AS stats',
      [id_user]
    );
    const stats = rows[0].stats; // MySQL retourne déjà un objet JSON
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching swipe stats:', error);
    res.status(500).json({ message: 'Failed to fetch swipe stats.' });
  }
});

// Check if the user is an admin
app.get('/is-admin/:id_user', async (req, res) => {
  const { id_user } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT username FROM Users WHERE id_user = ? AND username = "admin"',
      [id_user]
    );

    if (rows.length > 0) {
      res.status(200).json({ isAdmin: true });
    } else {
      res.status(200).json({ isAdmin: false }); // Return 200 with isAdmin: false instead of 403
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Failed to check admin status.' });
  }
});

// Get all users for admin dashboard
app.get('/admin/users', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM AdminUserList');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    res.status(500).json({ message: 'Failed to fetch users for admin.' });
  }
});

// Get all games for admin dashboard
app.get('/admin/games', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM AdminGameList');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games for admin:', error);
    res.status(500).json({ message: 'Failed to fetch games for admin.' });
  }
});

// Search games by name
app.get('/admin/search-games', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT idgame, name, description, thumbnail
       FROM Games
       WHERE LOWER(name) LIKE CONCAT('%', LOWER(?), '%')`,
      [query]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error searching games:', error);
    res.status(500).json({ message: 'Failed to search games.' });
  }
});

// Delete a user (admin only)
app.post('/admin/delete-user', async (req, res) => {
  const { userId } = req.body;
  try {
    await db.promise().query('DELETE FROM Users WHERE id_user = ?', [userId]);
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// Delete a game (admin only)
app.post('/admin/delete-game', async (req, res) => {
  const { gameId } = req.body;
  try {
    await db.promise().query('DELETE FROM Games WHERE idgame = ?', [gameId]);
    res.status(200).json({ message: 'Game deleted successfully.' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Failed to delete game.' });
  }
});

// Add a new user (admin only)
app.post('/admin/add-user', async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    await db.promise().query(
      'INSERT INTO Users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, username, email, password]
    );
    res.status(201).json({ message: 'User added successfully.' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Failed to add user.' });
  }
});

// Add a new game (admin only)
app.post('/admin/add-game', async (req, res) => {
  const { name, description, yearpublished, maxplayers, playingtime, thumbnail } = req.body;

  if (!name || !description || !yearpublished || !maxplayers || !playingtime) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    await db.promise().query(
      'INSERT INTO Games (name, description, yearpublished, maxplayers, playingtime, thumbnail) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, yearpublished, maxplayers, playingtime, thumbnail]
    );
    res.status(201).json({ message: 'Game added successfully.' });
  } catch (error) {
    console.error('Error adding game:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to add game.' });
  }
});

// Add a new game with details (categories and designers)
app.post('/admin/add-game-with-details', async (req, res) => {
  const { name, description, yearpublished, maxplayers, playingtime, thumbnail, categories, designers } = req.body;

  if (!name || !description || !yearpublished || !maxplayers || !playingtime) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    await db.promise().query('CALL sp_AddGameWithDetails(?, ?, ?, ?, ?, ?, ?, ?)', [
      name,
      description,
      yearpublished,
      maxplayers,
      playingtime,
      thumbnail,
      JSON.stringify(categories),
      JSON.stringify(designers),
    ]);
    res.status(201).json({ message: 'Game with details added successfully.' });
  } catch (error) {
    console.error('Error adding game with details:', error);
    res.status(500).json({ message: 'Failed to add game with details.' });
  }
});

// Create a category and assign games to it (admin only)
app.post('/admin/create-category', async (req, res) => {
  const { categoryName, gameIds } = req.body;

  if (!categoryName || !Array.isArray(gameIds)) {
    return res.status(400).json({ message: 'Category name and game IDs are required.' });
  }

  try {
    await db.promise().query('CALL sp_CreateCategoryAndAssignGames(?, ?)', [
      categoryName,
      JSON.stringify(gameIds),
    ]);
    res.status(201).json({ message: 'Category created and games assigned successfully.' });
  } catch (error) {
    console.error('Error creating category and assigning games:', error);
    res.status(500).json({ message: 'Failed to create category and assign games.' });
  }
});

// Get games by category (admin only)
app.get('/admin/games-by-category', async (req, res) => {
  const { categoryName } = req.query;

  if (!categoryName) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const [rows] = await db.promise().query('CALL sp_GetGamesByCategory(?)', [categoryName]);
    res.status(200).json(rows[0]); // Return the games in the specified category
  } catch (error) {
    console.error('Error fetching games by category:', error);
    res.status(500).json({ message: 'Failed to fetch games by category.' });
  }
});

// Get all categories (admin only)
app.get('/admin/categories', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_category, name FROM Category');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

// Add a game to a category (admin only)
app.post('/admin/add-game-to-category', async (req, res) => {
  const { gameId, categoryId } = req.body;

  if (!gameId || !categoryId) {
    return res.status(400).json({ message: 'Game ID and Category ID are required.' });
  }

  try {
    await db.promise().query(
      'INSERT IGNORE INTO categorise (id_game, id_category) VALUES (?, ?)',
      [gameId, categoryId]
    );
    res.status(201).json({ message: 'Game added to category successfully.' });
  } catch (error) {
    console.error('Error adding game to category:', error);
    res.status(500).json({ message: 'Failed to add game to category.' });
  }
}
);

// Create a designer (admin only)
app.post('/admin/create-designer', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Designer name is required.' });
  }

  try {
    await db.promise().query('INSERT INTO Designer (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Designer created successfully.' });
  } catch (error) {
    console.error('Error creating designer:', error);
    res.status(500).json({ message: 'Failed to create designer.' });
  }
});

// Create a publisher (admin only)
app.post('/admin/create-publisher', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Publisher name is required.' });
  }

  try {
    await db.promise().query('INSERT INTO Publisher (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Publisher created successfully.' });
  } catch (error) {
    console.error('Error creating publisher:', error);
    res.status(500).json({ message: 'Failed to create publisher.' });
  }
});

// Create an implementation (admin only)
app.post('/admin/create-implementation', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Implementation name is required.' });
  }

  try {
    await db.promise().query('INSERT INTO Implementation (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Implementation created successfully.' });
  } catch (error) {
    console.error('Error creating implementation:', error);
    res.status(500).json({ message: 'Failed to create implementation.' });
  }
});

// Create a family (admin only)
app.post('/admin/create-family', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Family name is required.' });
  }

  try {
    await db.promise().query('INSERT INTO Family (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Family created successfully.' });
  } catch (error) {
    console.error('Error creating family:', error);
    res.status(500).json({ message: 'Failed to create family.' });
  }
});

// Get all designers (admin only)
app.get('/admin/designers', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_designer, name FROM Designer');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching designers:', error);
    res.status(500).json({ message: 'Failed to fetch designers.' });
  }
});

// Get all publishers (admin only)
app.get('/admin/publishers', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_publisher, name FROM Publisher');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ message: 'Failed to fetch publishers.' });
  }
});

// Get all implementations (admin only)
app.get('/admin/implementations', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_implementation, name FROM Implementation');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching implementations:', error);
    res.status(500).json({ message: 'Failed to fetch implementations.' });
  }
});

// Get all families (admin only)
app.get('/admin/families', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT id_family, name FROM Family');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching families:', error);
    res.status(500).json({ message: 'Failed to fetch families.' });
  }
});

// Get games by designer (admin only)
app.get('/admin/games-by-designer', async (req, res) => {
  const { designerName } = req.query;

  if (!designerName) {
    return res.status(400).json({ message: 'Designer name is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT G.idgame, G.name, G.description, G.thumbnail
       FROM Games G
       JOIN design D ON G.idgame = D.id_game
       JOIN Designer De ON D.id_designer = De.id_designer
       WHERE De.name = ?`,
      [designerName]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games by designer:', error);
    res.status(500).json({ message: 'Failed to fetch games by designer.' });
  }
});

// Get games by publisher (admin only)
app.get('/admin/games-by-publisher', async (req, res) => {
  const { publisherName } = req.query;

  if (!publisherName) {
    return res.status(400).json({ message: 'Publisher name is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT G.idgame, G.name, G.description, G.thumbnail
       FROM Games G
       JOIN publish P ON G.idgame = P.id_game
       JOIN Publisher Pu ON P.id_publisher = Pu.id_publisher
       WHERE Pu.name = ?`,
      [publisherName]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games by publisher:', error);
    res.status(500).json({ message: 'Failed to fetch games by publisher.' });
  }
});

// Get games by implementation (admin only)
app.get('/admin/games-by-implementation', async (req, res) => {
  const { implementationName } = req.query;

  if (!implementationName) {
    return res.status(400).json({ message: 'Implementation name is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT G.idgame, G.name, G.description, G.thumbnail
       FROM Games G
       JOIN Implementation I ON G.idgame = I.id_game
       WHERE I.name = ?`,
      [implementationName]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games by implementation:', error);
    res.status(500).json({ message: 'Failed to fetch games by implementation.' });
  }
});

// Get games by family (admin only)
app.get('/admin/games-by-family', async (req, res) => {
  const { familyName } = req.query;

  if (!familyName) {
    return res.status(400).json({ message: 'Family name is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      `SELECT G.idgame, G.name, G.description, G.thumbnail
       FROM Games G
       JOIN own O ON G.idgame = O.id_game
       JOIN Family F ON O.id_family = F.id_family
       WHERE F.name = ?`,
      [familyName]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games by family:', error);
    res.status(500).json({ message: 'Failed to fetch games by family.' });
  }
});

// Add a game to a designer (admin only)
app.post('/admin/add-game-to-designer', async (req, res) => {
  const { gameId, entityId } = req.body;

  if (!gameId || !entityId) {
    return res.status(400).json({ message: 'Game ID and Designer ID are required.' });
  }

  try {
    await db.promise().query(
      'INSERT IGNORE INTO design (id_game, id_designer) VALUES (?, ?)',
      [gameId, entityId]
    );
    res.status(201).json({ message: 'Game added to designer successfully.' });
  } catch (error) {
    console.error('Error adding game to designer:', error);
    res.status(500).json({ message: 'Failed to add game to designer.' });
  }
});

// Add a game to a publisher (admin only)
app.post('/admin/add-game-to-publisher', async (req, res) => {
  const { gameId, entityId } = req.body;

  if (!gameId || !entityId) {
    return res.status(400).json({ message: 'Game ID and Publisher ID are required.' });
  }

  try {
    await db.promise().query(
      'INSERT IGNORE INTO publish (id_game, id_publisher) VALUES (?, ?)',
      [gameId, entityId]
    );
    res.status(201).json({ message: 'Game added to publisher successfully.' });
  } catch (error) {
    console.error('Error adding game to publisher:', error);
    res.status(500).json({ message: 'Failed to add game to publisher.' });
  }
});

// Add a game to an implementation (admin only)
app.post('/admin/add-game-to-implementation', async (req, res) => {
  const { gameId, entityId } = req.body;

  if (!gameId || !entityId) {
    return res.status(400).json({ message: 'Game ID and Implementation ID are required.' });
  }

  try {
    await db.promise().query(
      'INSERT IGNORE INTO Implementation (id_game, id_implementation) VALUES (?, ?)',
      [gameId, entityId]
    );
    res.status(201).json({ message: 'Game added to implementation successfully.' });
  } catch (error) {
    console.error('Error adding game to implementation:', error);
    res.status(500).json({ message: 'Failed to add game to implementation.' });
  }
});

// Add a game to a family (admin only)
app.post('/admin/add-game-to-family', async (req, res) => {
  const { gameId, entityId } = req.body;

  if (!gameId || !entityId) {
    return res.status(400).json({ message: 'Game ID and Family ID are required.' });
  }

  try {
    await db.promise().query(
      'INSERT IGNORE INTO own (id_game, id_family) VALUES (?, ?)',
      [gameId, entityId]
    );
    res.status(201).json({ message: 'Game added to family successfully.' });
  } catch (error) {
    console.error('Error adding game to family:', error);
    res.status(500).json({ message: 'Failed to add game to family.' });
  }
});

// Get user details by username
app.get('/account/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email, birthdate FROM Users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
});

// Update user birthdate
app.post('/update-birthdate', async (req, res) => {
  const { id_user, birthdate } = req.body;

  if (!id_user || !birthdate) {
    return res.status(400).json({ message: 'User ID and birthdate are required.' });
  }

  try {
    await db.promise().query(
      'UPDATE Users SET birthdate = ? WHERE id_user = ?',
      [birthdate, id_user]
    );
    res.status(200).json({ message: 'Birthdate updated successfully.' });
  } catch (error) {
    console.error('Error updating birthdate:', error);
    res.status(500).json({ message: 'Failed to update birthdate.' });
  }
});

// Change user password
app.post('/change-password', async (req, res) => {
  const { id_user, newPassword } = req.body;

  if (!id_user || !newPassword) {
    return res.status(400).json({ message: 'User ID and new password are required.' });
  }

  try {
    await db.promise().query(
      'UPDATE Users SET password = ? WHERE id_user = ?',
      [newPassword, id_user]
    );
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Failed to update password.' });
  }
});

// Get the most liked game
app.get('/most-liked-game', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT idgame, name, description, thumbnail FROM Games WHERE idgame = fn_MostLikedGame()'
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No most liked game found.' });
    }

    res.status(200).json({ game: rows[0] });
  } catch (error) {
    console.error('Error fetching the most liked game:', error);
    res.status(500).json({ message: 'Failed to fetch the most liked game.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
