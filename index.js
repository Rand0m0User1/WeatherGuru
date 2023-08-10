const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

app.use(express.static('public'));

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
  res.type('text/css');
});

app.get('/weather.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'weather.js'));
  res.type('application/javascript');
});

app.get('/api/key', (req, res) => {
  res.json({ api_key: process.env.CLIENT_ID || '' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// All other routes are handled by serving static files
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.path));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
