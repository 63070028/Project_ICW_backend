const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem } = require("../dynamodb");
const { updateItem } = require("../dynamodb");
const { uploadToS3 } = require("../s3");

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

router.post("/edit",upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const profileImageFile = req.files["profile_image"]?.[0];
    const backgroundImageFile = req.files["background_image"]?.[0];
    let profileImageUrl = "";
    let backgroundImageUrl = "";
    try {
      if (profileImageFile) {
        const fileName = `${req.body.id}-${uuidv4()}-${profileImageFile.originalname
          }`;
        const folderS3 = "images";
        profileImageUrl = await uploadToS3(
          `${process.env.S3_BUCKET}`,
          fileName,
          folderS3,
          profileImageFile
        );
        console.log("Profile image uploaded to:", profileImageUrl);
      }
      if (backgroundImageFile) {
        const fileName = `${req.body.id}-${uuidv4()}-${backgroundImageFile.originalname
          }`;
        const folderS3 = "background_images";
        backgroundImageUrl = await uploadToS3(
          `${process.env.S3_BUCKET}`,
          fileName,
          folderS3,
          backgroundImageFile
        );
        console.log("Background image uploaded to:", backgroundImageUrl);
      }
      const params = {
        TableName: "company",
        Key: {
          id: { S: req.body.id },
        },
        UpdateExpression: `
        name = :name,
        description = :description,
        ${profileImageUrl ? "profile_image = :profile_image," : ""}
        ${backgroundImageUrl ? "background_image = :background_image," : ""}
        video_iframe = :video_iframe,
        state = :state
      `,
      ExpressionAttributeValues: {

        ":name": { S: req.body.name },
        ":description": { S: req.body.description},
        ":profile_image": {S: profileImageUrl},
        ":background_image": { S: backgroundImageUrl},
        ":video_iframe": { S: req.body.video_iframe },
        ":state": { S: req.body.state },
        }
      };

      try {
        await updateItem(params);
        res.status(201).json({
          message: "Company profile updated successfully",
          ...(profileImageUrl ? { profile_image: profileImageUrl } : {}),
          ...(backgroundImageUrl ? { background_image: backgroundImageUrl } : {}),
        });
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
