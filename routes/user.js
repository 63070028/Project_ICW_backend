const express = require("express");
const router = express.Router();

const { putItem, scanTable } = require("../dynamodb");
const isAuthen = require("../middleware/isAuthen");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

router.post("/signIn", async (req, res) => {
  console.log(req.body);

  try {
    const items = await scanTable({ TableName: req.body.role });
    const user = items.find((item) => item.email.S === req.body.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!(user.password.S === req.body.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('test')

    const tokens = await scanTable({ TableName: "authen" });
    let token = tokens.find((token) => token.user_id.S === user.id.S);

    if (!token) {
      //// Generate and save token into database
      token = jwt.sign(
        { id: user.id.S, role: req.body.role },
        `${process.env.secretKey}`
      );
      const token_prams = {
        TableName: "authen",
        Item: {
          id: { S: uuidv4() },
          user_id: { S: user.id.S },
          token: { S: token },
        },
      };
      await putItem(token_prams);
      res.json({ token: token, id: user.id.S, user_role: req.body.role });
    } else {
      res.json({
        token: token.token.S,
        id: user.id.S,
        user_role: req.body.role,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getData", isAuthen, async (req, res) => {
  console.log(req.user.id);

  try {
    const users = await scanTable({ TableName: req.user.role });
    const user_t = users.find((user) => user.id.S == req.user.id);
    console.log(user_t);
    const user = {
      id: user_t.id.S,
      email: user_t.email.S,
      role: req.user.role,
      state: user_t.state.S,
    };

    res.json({
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
