const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const { v4: uuidv4 } = require("uuid");
const { uploadToS3, deleteObjectToS3 } = require("../s3");
const { putItem, scanTable, updateItem } = require("../dynamodb");
const isAuthen = require("../middleware/isAuthen");

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

router.get("/getProfile/:id", async (req, res) => {
  try {
    const applicants = await scanTable({ TableName: "applicant" });
    const applicant_t = applicants.find((item) => item.id.S == req.params.id);
    const applicant = {
      id: applicant_t.id.S,
      firstName: applicant_t.firstName.S,
      lastName: applicant_t.lastName.S,
      email_profile: applicant_t.email_profile.S,
      birthDate: applicant_t.birthDate.S,
      gender: applicant_t.gender.S,
      address: applicant_t.address.S,
      phone: applicant_t.phone.S,
      resume: applicant_t.resume.S,
      transcript: applicant_t.transcript.S,
      portfolio: applicant_t.portfolio.S,
      state: applicant_t.state.S,
    };
    res.status(201).json({
      applicant: applicant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/editProfile",  async (req, res) => {
  console.log(req.body)

  // const params = {
  //   TableName: "applicant",
  //   Item: {
  //     id: { S: req.body.id }, // String type
  //     firstName: { S: req.body.firstName },
  //     lastName: { S: req.body.lastName },
  //     email_profile: { S: req.body.email_profile },
  //     birthDate: { S: req.body.birthDate },
  //     gender: { S: req.body.gender },
  //     address: { S: req.body.address },
  //     phone: { S: req.body.phone },
  //     state: { S: req.body.state },
  //   },
  // };

  const params = {
    TableName: "applicant",
    Key: {
      "id": { "S":  req.body.id }
    },
    UpdateExpression: "SET firstName = :val1, lastName = :val2, email_profile = :val3, birthDate = :val4, gender = :val5, address = :val6, phone = :val7, #s = :val8",
    ExpressionAttributeValues: {
      ":val1": { "S": req.body.firstName },
      ":val2": { "S": req.body.lastName  },
      ":val3": { "S": req.body.email_profile  },
      ":val4": { "S": req.body.birthDate },
      ":val5": { "S": req.body.gender },
      ":val6": { "S": req.body.address },
      ":val7": { "S":  req.body.phone },
      ":val8": { "S":  req.body.state },

    },
    ExpressionAttributeNames: {
      "#s": "state"
    },  
    ReturnValues: "ALL_NEW"
  };


  try {
    await updateItem(params);
    res.status(201).json({
      message: "signUp successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

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
