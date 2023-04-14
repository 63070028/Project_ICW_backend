const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem} = require("../dynamodb");
const { updateItem } = require("../dynamodb");

const multer = require("multer");
const upload = multer();


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

router.post("/edit", upload.single(""), async (req, res) => {
  console.log(req.body)
  
  //database
//  const params = {
//    TableName: "company",
//    Item: {
//      id: { S: uuidv4() }, // String type
//      email: { S: req.body.email },
//      password: { S: req.body.password },
//      name: { S: req.body.name },
//      description: { S: req.body.description },
//      profile_image: { S: req.body.profile_image },
//      background_image: { S: req.body.background_image },
//      video_iframe: { S: req.body.video_iframe },
//      state: { S: req.body.state },
//    },
//  };
//
//  try {
//    const data = await updateItem(params);
//    res.status(200).json({
//      message: "Company profile updated successfully",
//      updatedProfile: data,
//    });
//  } catch (error) {
//    console.error(error);
//    res.status(500).send(error.message);
//  }
});

module.exports = router;
