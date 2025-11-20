const mongoose = require("mongoose");

function connectDb() {
  console.log("Loaded MONGO URL:", process.env.MONGODB_URL); 

  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("Error connecting to DB:", err));
}

module.exports = connectDb;
