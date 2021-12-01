const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6000;

app.listen(PORT, console.log(`Server running  on port ${PORT}`));
