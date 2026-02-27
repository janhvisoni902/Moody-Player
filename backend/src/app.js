const express = require("express");
const cors = require("cors");
const songRoutes = require("./routes/song.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://melodious-pastelito-533ecd.netlify.app",
  "https://famous-llama-060d9c.netlify.app",
  "https://moody-player-lh7w.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

app.use(express.json());
app.use("/", songRoutes);

module.exports = app;
