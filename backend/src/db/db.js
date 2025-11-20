const mongoose = require("mongoose");
require("dotenv").config();

function connectDb() {
  const mongoURI = process.env.MONGODB_URL;

  if (!mongoURI) {
    console.error(" MONGODB_URL not found in .env");
    return;
  }

  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(" MongoDB Connected Successfully"))
    .catch((err) =>
      console.error(" MongoDB Connection Failed: ", err.message)
    );
}

module.exports = connectDb;
