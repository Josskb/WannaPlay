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

// Get user by GET
app.get('/account/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email, birthdate FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
});

// Get user by POST
app.post('/account', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: 'Username is required.' });
  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email, birthdate FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user: rows[0] });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details.' });
  }
});

// Recommend a game
app.get('/recommendation/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT fn_RecommendRandomGame(?) AS recommended_game',
      [id_user]
    );
    const recommendedGameId = rows[0].recommended_game;
    if (recommendedGameId === null) {
      return res.status(404).json({ message: 'No recommendation found for this user.' });
    }
    res.status(200).json({ recommended_game_id: recommendedGameId });
  } catch (error) {
    console.error('Error fetching game recommendation:', error);
    res.status(500).json({ message: 'Failed to get recommendation.' });
  }
});

// Get game details
app.get('/game/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      'SELECT idgame, name, description, thumbnail FROM Games WHERE idgame = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Game not found.' });
    res.status(200).json({ game: rows[0] });
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Failed to fetch game details.' });
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

app.post('/update-birthdate', async (req, res) => {
  const { id_user, birthdate } = req.body;
  try {
    await db.promise().query('UPDATE users SET birthdate = ? WHERE id_user = ?', [birthdate, id_user]);
    res.status(200).json({ message: 'Birthdate updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update birthdate' });
  }
});

app.post('/change-password', async (req, res) => {
  const { id_user, newPassword } = req.body;
  try {
    await db.promise().query('UPDATE users SET password = ? WHERE id_user = ?', [newPassword, id_user]);
    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});