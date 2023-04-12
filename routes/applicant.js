const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3, deleteObjectToS3} = require("../s3");
const { putItem, scanTable } = require("../dynamodb");
const upload = multer();

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

router.post("/signIn", async (req, res) => {
  console.log(req.body);

  //ตรวจข้อมูลใน database
  const params = { TableName: "applicant" };

  try {
    const items = await scanTable(params);
    const user = items.find((item) => item.email.S === req.body.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user: { id: user.id.S, email: user.email.S } },
      `${process.env.secretKey}`
    );

    const token_prams = {
      TableName: "token",
      Item: {
        id: { S: uuidv4() },
        applicant_id: { S: user.id.S },
        token: { S: token }, 
      },
    };

    putItem(token_prams);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

  //res applicant_info
});

router.post("/signUp", async (req, res) => {
  //database
  console.log(req.body);

  const params = {
    TableName: "applicant",
    Item: {
      id: { S: uuidv4() }, // String type
      email: { S: req.body.email },
      password: { S: req.body.password },
      firstName: { S: req.body.firstName },
      lastName: { S: req.body.lastName },
      email_profile: { S: req.body.email_profile },
      birthDate: { S: req.body.birthDate },
      gender: { S: req.body.gender },
      address: { S: req.body.address },
      phone: { S: req.body.phone },
      resume: { S: req.body.resume },
      transcript: { S: req.body.transcript },
      portfolio: { S: req.body.portfolio },
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

router.post("/profile/edit", (req, res) => {
  console.log("Applicant Profile");
  console.log(req.body);

  //database
});

// เก็บใน local
// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     console.log(req.body.user_id);
//     const uniqueSuffix = Date.now() + "-" + uuidv4();
//     const extension = path.extname(file.originalname);
//     const baseName = path.basename(file.originalname, extension);
//     const user_id = req.body.user_id;
//     cb(null, user_id+baseName + "-" + uniqueSuffix + extension);
//   },
// });
// const upload = multer({ storage: storage });

router.post("/resume/upload", upload.single("file"), async (req, res) => {
  console.log("Applicant Resume Upload " + req.body.user_id);
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  const FileName = `${req.body.user_id}-${uuidv4()}-${file.originalname}`;
  const FolderS3 = "resume";
  try {
    const location = await uploadToS3(
      `${process.env.S3_BUCKET}`,
      FileName,
      FolderS3,
      file
    );
    console.log("File uploaded to:", location);
    res.status(201).json({ url: location });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/resume/edit", upload.single("file"), async (req, res) => {
  console.log("Applicant Resume Edit " + req.body.user_id);
  const file = req.file;
  if (!file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  //ลบอันเก่า
  const s3ObjectUrl = req.body.urlOld;
  try {
    await deleteObjectToS3(`${process.env.S3_BUCKET}`, s3ObjectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
  console.log("File Deleted");

  //อัปอันใหม่
  const FileName = `${req.body.user_id}-${uuidv4()}-${file.originalname}`;
  const FolderS3 = "resume";
  try {
    const location = await uploadToS3(
      `${process.env.S3_BUCKET}`,
      FileName,
      FolderS3,
      file
    );
    console.log("File uploaded to:", location);
    res.status(201).json({ url: location });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
