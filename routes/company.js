const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem} = require("../dynamodb");

router.post("/signIn", (req, res) => {
  console.log("Applicant Company");
  console.log(req.body);

  //ตรวจข้อมูลใน database

  //res applicant_info
});

router.post("/signUp", async (req, res) => {
  //database
  const params = {
    TableName: "company",
    Item: {
      id: { S: uuidv4() }, // String type
      email: { S: req.body.email },
      password: { S: req.body.password },
      name: { S: req.body.name },
      description: { S: req.body.description },
      profile_image: { S: req.body.profile_image },
      background_image: { S: req.body.background_image },
      video_iframe: { S: req.body.video_iframe },
      state: { S: req.body.state },
    },
  };

  try {
    await putItem(params);
    res.status(201).json({
      message: "signUp successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
