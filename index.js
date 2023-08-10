const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static('public'));

app.get('/api/key', (req, res) => {
  res.json({ api_key: process.env.CLIENT_ID || '' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});