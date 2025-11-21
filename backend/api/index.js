const express = require('express');
const cors = require('cors');
const app = express();

// Add CORS so frontend can call your API
app.use(cors());

// Your API route
app.get('/api/songs', (req, res) => {
  const mood = req.query.mood;
  // Fetch/filter songs by mood logic...
  res.json({ songs: [] }); // replace with your logic
});
require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/db");

connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));


module.exports = app;
