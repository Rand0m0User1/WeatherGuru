const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path'); // Add this line
dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/key', (req, res) => {
  res.json({ api_key: process.env.CLIENT_ID || '' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})