const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem } = require("../dynamodb");
const { updateItem } = require("../dynamodb");
const { uploadToS3 } = require("../s3");

const multer = require("multer");
const upload = multer();

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

router.post("/edit",upload.fields([{ name: "profile_image", maxCount: 1 }, { name: "background_image", maxCount: 1 },]),async (req, res) => {
    console.log(req.body);
    console.log(req.files)
    const profileImageFile = req.files["profile_image"]?.[0];
    const backgroundImageFile = req.files["background_image"]?.[0];
    let profileImageUrl = "";
    let backgroundImageUrl = "";
    try {
      if (profileImageFile) {
        const FileName = `${req.body.company_id}-${uuidv4()}-${
          profileImageFile.originalname
        }`;
        const FolderS3 = "images"; // เปลี่ยน FolderS3 เป็น "images"
        profileImageUrl = await uploadToS3(
          `${process.env.S3_BUCKET}`,
          FileName,
          FolderS3,
          profileImageFile
        );
        console.log("Profile image uploaded to:", profileImageUrl);
      }
      
      if (backgroundImageFile) {
        const FileName = `${req.body.company_id}-${uuidv4()}-${
          backgroundImageFile.originalname
        }`;
        const FolderS3 = "background_images";
        backgroundImageUrl = await uploadToS3(
          `${process.env.S3_BUCKET}`,
          FileName,
          FolderS3,
          backgroundImageFile
        );
        console.log("Background image uploaded to:", backgroundImageUrl);
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
