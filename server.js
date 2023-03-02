require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.listen(port, () => {
  console.log(`Digimart app listening on port ${port}`);
});
