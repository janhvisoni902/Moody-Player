require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");

connectDb();

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://melodious-pastelito-533ecd.netlify.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

