const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const { v4: uuidv4 } = require("uuid");
const { uploadToS3, deleteObjectToS3 } = require("../s3");
const { putItem, scanTable } = require("../dynamodb");
const jwt = require("jsonwebtoken");
const isAuthen = require("../middleware/isAuthen");

router.post("/signIn", async (req, res) => {
  console.log(req.body);

  //ตรวจข้อมูลใน database
  try {
    const items = await scanTable({ TableName: "applicant" });
    const user = items.find((item) => item.email.S === req.body.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!(user.password.S === req.body.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user_data = {
      id: user.id.S,
      firstName: user.firstName.S,
      lastName: user.lastName.S,
      email_profile: user.email_profile.S,
      birthDate: user.birthDate.S,
      gender: user.gender.S,
      address: user.address.S,
      phone: user.phone.S,
      resume: user.resume.S,
      transcript: user.transcript.S,
      portfolio: user.portfolio.S,
      state: user.state.S,
    };

    const tokens = await scanTable({ TableName: "authen" });
    let token = tokens.find((token) => token.user_id.S === user.id.S);

    console.log(token);
    if (!token) {
      //// Generate and save token into database
      token = jwt.sign({ id: user.id.S , role: 'applicant'}, `${process.env.secretKey}`);
      const token_prams = {
        TableName: "authen",
        Item: {
          id: { S: uuidv4() },
          user_id: { S: user.id.S },
          token: { S: token },
        },
      };
      await putItem(token_prams);
      res.json({ token:token, id: user_data.id, user_role: "applicant" });
    } else {
      res.json({
        token:token.token.S,
        id: user_data.id,
        user_role: "applicant",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
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

router.post("/sendReport", async (req, res) => {
  //database
  console.log(req.body);

  const params = {
    TableName: "JobReport",
    Item: {
      id: { S: uuidv4() }, // String type
      message: { S: req.body.message },
      user_id: { S: req.body.user_id },
      job_id: { S: req.body.job_id },
      creation_date: { S: req.body.creation_date },
    },
  };

  try {
    await putItem(params);
    res.status(201).json({
      message: "sendReport successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
//sendReport

module.exports = router;
