require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");

connectDb();

const cors = require("cors");

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
    }
  })
);
 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

