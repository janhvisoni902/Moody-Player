
const express = require("express");
const cors = require("cors");
const songRoutes = require("./routes/song.routes");

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow common methods
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Allow common headers
  next();
});

// Example for Node.js/Express with 'cors' package
const allowedOrigins = [
  "http://localhost:5173",
  "https://melodious-pastelito-533ecd.netlify.app"
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
    methods: ["GET", "POST"],
  })
);



// app.use(
//   cors({
//     origin: [
//       "http://https://moody-player-lh7w.onrender.com"
//     ],
//     credentials: true
//   })
// );

app.use(express.json());
app.use("/", songRoutes);

module.exports = app;
