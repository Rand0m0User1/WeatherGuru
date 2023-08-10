const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const router = express.Router();
dotenv.config();


app.use("/", router)


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'))
});

router.get('/css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/styles.css'))
});

router.get('/javascript', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/weather.js'))
});

router.get('/api/key', (req, res) => {
  res.json({ api_key: process.env.CLIENT_ID || '' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});