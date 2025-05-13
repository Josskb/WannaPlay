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
    const [rows] = await db.promise().query('CALL sp_GetLikedGames(?)', [id_user]);
    res.status(200).json({ games: rows[0] });
  } catch (error) {
    console.error('Error fetching liked games:', error);
    res.status(500).json({ message: 'Failed to fetch liked games.' });
  }
});

// Get disliked games for a user
app.get('/disliked-games/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await db.promise().query('CALL sp_GetDislikedGames(?)', [id_user]);
    res.status(200).json({ games: rows[0] });
  } catch (error) {
    console.error('Error fetching disliked games:', error);
    res.status(500).json({ message: 'Failed to fetch disliked games.' });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
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
    await db.promise().query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
