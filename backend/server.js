const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5001; 

app.use(cors());
app.use(bodyParser.json());

// Connect to MYSQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin', 
  database: 'board_game_db',
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


// Get user details by GET method
app.get('/account/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email, birthdate FROM users WHERE username = ?',
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

// Get user details by POST method
app.post('/account', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id_user, username, email, birthdate FROM users WHERE username = ?',
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

// Generate a game 
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});