require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use("/api/auth", require("./auth"));
app.use("/api/store", require("./routes/store"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.listen(port, () => {
  console.log(`Digimart app listening on port ${port}`);
});
