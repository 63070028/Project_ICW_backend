const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem, scanTable, updateItem } = require("../dynamodb");
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

router.post(
  "/edit",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "background_image", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    const profileImageFile = req.files["profile_image"]?.[0];
    const backgroundImageFile = req.files["background_image"]?.[0];
    // let profileImageUrl = "";
    // let backgroundImageUrl = "";
    try {
      const fileNameProfileImage = `${req.body.id}-${uuidv4()}-${
        profileImageFile.originalname
      }`;
      const foldeImagesrS3 = "images";
      const profileImageUrl = await uploadToS3(
        `${process.env.S3_BUCKET}`,
        fileNameProfileImage,
        foldeImagesrS3,
        profileImageFile
      );
      console.log("Profile image uploaded to:", profileImageUrl);

      const fileNameBackgroundImage = `${req.body.id}-${uuidv4()}-${
        backgroundImageFile.originalname
      }`;
      const folderBackgroundS3 = "background_images";
      const backgroundImageUrl = await uploadToS3(
        `${process.env.S3_BUCKET}`,
        fileNameBackgroundImage,
        folderBackgroundS3,
        backgroundImageFile
      );
      console.log("Background image uploaded to:", backgroundImageUrl);

      const params = {
        TableName: "company",
        Key: {
          id: { S: req.body.id },
        },
        UpdateExpression:
          "SET #n = :val1,  description = :val2, profile_image = :val3, background_image = :val4, video_iframe = :val5, #s = :val8",
        ExpressionAttributeValues: {
          ":val1": { S: req.body.name },
          ":val2": { S: req.body.description },
          ":val3": { S: profileImageUrl },
          ":val4": { S: backgroundImageUrl },
          ":val5": { S: req.body.video_iframe },
          ":val8": { S: req.body.state },
        },
        ExpressionAttributeNames: {
          "#s": "state",
          "#n": "name",
        },
        ReturnValues: "ALL_NEW",
      };
      await updateItem(params);
      res.status(201).json({
        message: "Company profile updated successfully",
        profile_image: profileImageUrl,
        background_image: backgroundImageUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

//getcompany
router.get("/getProfile/:id", async (req, res) => {
  try {
    const companies = await scanTable({ TableName: "company" });
    const company_t = companies.find((item) => item.id.S == req.params.id);
    const company = {
      id: company_t.id.S,
      name: company_t.name.S,
      email: company_t.email.S,
      description: company_t.description.S,
      profile_image: company_t.profile_image.S,
      background_image: company_t.background_image.S,
      video_iframe: company_t.video_iframe.S,
      state: company_t.state.S,
    };
    res.status(201).json({
      company: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//getJob
router.get("/getJob/:id", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "job" });

    const jobs_t = items.filter((item) => item.company_id.S == req.params.id);

    const jobs = jobs_t.map((item) => {
      return {
        id: item.id.S,
        capacity: item.capacity.N,
        company_name: item.company_name.S,
        company_id: item.company_id.S,
        creation_date: item.creation_date.S,
        detail: item.detail.S,
        interview: item.interview.S,
        location: item.location.S,
        name: item.name.S,
        salary_per_day: item.salary_per_day.N,
        contact: {
          name: item.contact.M.name.S,
          email: item.contact.M.email.S,
          phone: item.contact.M.phone.S,
        },
        qualifications: item.qualifications.SS,
        state: item.state.S,
      };
    });

    res.status(201).json({
      items: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getJobById/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const items = await scanTable({ TableName: "job" });
    const job_t = items.find((item) => item.id.S == req.params.id);

    const job = {
      id: job_t.id.S,
      capacity: job_t.capacity.N,
      company_name: job_t.company_name.S,
      company_id: job_t.company_id.S,
      creation_date: job_t.creation_date.S,
      detail: job_t.detail.S,
      interview: job_t.interview.S,
      location: job_t.location.S,
      name: job_t.name.S,
      salary_per_day: job_t.salary_per_day.N,
      contact: {
        name: job_t.contact.M.name.S,
        email: job_t.contact.M.email.S,
        phone: job_t.contact.M.phone.S,
      },
      qualifications: job_t.qualifications.SS,
      state: job_t.state.S,
    };
    res.status(201).json({
      job: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/setJobState", async (req, res) => {
  console.log(req.body);

  const params = {
    TableName: "job",
    Key: {
      id: { S: req.body.id },
    },
    UpdateExpression: "SET #s = :val8",
    ExpressionAttributeValues: {
      ":val8": { S: req.body.state },
    },
    ExpressionAttributeNames: {
      "#s": "state",
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    await updateItem(params);
    res.status(201).json({
      message: "updateState successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});



module.exports = router;
