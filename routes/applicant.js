const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { uploadToS3, deleteObjectToS3 } = require("../s3config");

const upload = multer();

router.post("/signIn", (req, res) => {
  console.log("Applicant SignIn");
  console.log(req.body);

  //ตรวจข้อมูลใน database

  //res applicant_info
});

router.post("/signUp", (req, res) => {
  console.log("Applicant SignUp");
  console.log(req.body);

  //database
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
