// const express = require("express");
// const cors = require("cors");
// const songRoutes = require("./routes/song.routes");

// const app = express();

// // ✅ Correct CORS allowed URLs
// const allowedOrigins = [
//   "https://poetic-eclair-256c76.netlify.app",
//   "http://localhost:5173"
// ];

// // ✅ CORS middleware FIRST
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     }
//   })
// );

// // ⚠️ DO NOT add cors() again — REMOVE this line:
// // app.use(cors(corsOptions));

// app.use(express.json());

// // ✅ ROUTES must come AFTER CORS + json()
// app.use("/", songRoutes);

// app.get("/", (req, res) => {
//   res.send("✅ Backend running properly!");
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const songRoutes = require("./routes/song.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://poetic-eclair-256c76.netlify.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());

// ROUTES
app.use("/", songRoutes);

app.get("/", (req, res) => {
  res.send("Backend working!");
});

module.exports = app;
