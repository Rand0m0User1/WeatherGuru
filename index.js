const express = require('express');
const product = require('./api/product');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(express.static('public'));

// Route to get API key
app.get('/api/key', (req, res) => {
  res.json({ api_key: process.env.CLIENT_ID || '' });
});

app.use("/api/product", product);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
