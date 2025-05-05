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