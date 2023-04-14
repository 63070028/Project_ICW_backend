const express = require("express");
const router = express.Router();
const { scanTable } = require("../dynamodb");
const isAuthen = require("../middleware/isAuthen");

router.get("/getData", isAuthen, async (req, res) => {
  console.log(req.user.id);

  try {
    if (req.user.role === "applicant") {
      const users = await scanTable({ TableName: "applicant" });
      const user_t = users.find((user) => user.id.S == req.user.id);
      console.log(user_t);
      const user = {
        id: user_t.id.S,
        email: user_t.email.S,
        role: "applicant",
        state: user_t.state.S,
      };

      res.json({
        user: user,
      });
    } else if (req.user.role === "company") {
      const users = await scanTable({ TableName: "company" });
      const user_t = users.find((user) => user.id.S == req.user.id);
      console.log(user_t);
      const user = {
        id: user_t.id.S,
        email: user_t.email.S,
        role: "company",
        state: user_t.state.S,
      };

      res.json({
        user: user,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
