require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");

connectDb();
const express = require("express");
const cors = require("cors");

const express = require("express");
const cors = require("cors");

// ⬇️ Add this BEFORE routes
app.use( ...CORS );

// your routes...
app.get("/songs", )


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://famous-llama-060d9c.netlify.app"  // your new Netlify domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.json());

 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

