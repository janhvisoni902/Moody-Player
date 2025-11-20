// const express = require("express");
// const multer = require('multer');
// const songRoutes = require('./routes/song.routes');

// const upload = multer({storage:multer.memoryStorage()});

// const app = express();
// app.use(express.json());

// app.use('/', songRoutes)

// module.exports = app;
const express = require("express");
const cors = require("cors");
const songRoutes = require("./routes/song.routes");

const app = express();

app.use(cors());

// ⚠️ DO NOT use express.json() here before Multer routes
app.use("/", songRoutes);


app.get("/", (req, res) => {
    res.send("✅ Backend running properly!");
  });
  

module.exports = app;
