require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const auth = require("./auth");
const storeRoute = require("./routes/store");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
app.use("/api/auth", auth);
app.use("/api/store", storeRoute);
// app.use("/api/store/users", storeRoute);
// app.use("/api/users", require("./routes/users"));
// app.use("/api/products", require("./routes/products"));
app.listen(port, () => {
  console.log(`Digimart app listening on port localhost:${port}`);
});
