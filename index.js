const express = require("express");
require("dotenv").config(); //ใข้งาน .env
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware
const logger = require("./middleware/logger");
const isAuthen = require("./middleware/isAuthen")

app.use(logger);

app.use("/applicant", require("./routes/applicant"));
app.use("/application", require("./routes/application"));
app.use("/company", require("./routes/company"));
app.use("/admin", require("./routes/admin"));
app.use("/user", require("./routes/user"));

app.get("/welcome", isAuthen, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

const port = `${process.env.PORT}`;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

