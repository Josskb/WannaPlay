const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
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

// Like a game
app.post('/like-game', async (req, res) => {
  const { id_user, id_game } = req.body;

  if (!id_user || !id_game) {
    return res.status(400).json({ message: 'User ID and Game ID are required.' });
  }

  try {
    // Insert into the 'enjoy' table
    await db.promise().query('INSERT INTO enjoy (id_user, id_game) VALUES (?, ?)', [id_user, id_game]);
    res.status(200).json({ message: 'Game liked successfully.' });
  } catch (error) {
    console.error('Error liking game:', error);
    res.status(500).json({ message: 'Failed to like game.' });
  }
});

// Unlike a game
app.post('/unlike-game', async (req, res) => {
  const { id_user, id_game } = req.body;

  try {
    // Delete from the 'enjoy' table
    await db.promise().query('DELETE FROM enjoy WHERE id_user = ? AND id_game = ?', [id_user, id_game]);
    res.status(200).json({ message: 'Game unliked successfully.' });
  } catch (error) {
    console.error('Error unliking game:', error);
    res.status(500).json({ message: 'Failed to unlike game.' });
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
