const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = require("./app");

//Database
const DB = process.env.DATABASE_URI;
mongoose
  .connect(DB, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database Successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

//server listen
const PORT = process.env.PORT || 6000;
const server = app.listen(PORT, () => {
  console.log(`Server running  on port ${PORT}`);
});
