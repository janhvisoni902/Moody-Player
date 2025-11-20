require("dotenv").config();
const app = require("./app");
const connectDb = require("./db/db");

connectDb();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
