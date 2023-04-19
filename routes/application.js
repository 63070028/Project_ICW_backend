const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const { putItem, scanTable, updateItem } = require("../dynamodb");
const isAuthen = require("../middleware/isAuthen");

router.post("/sendApplicationJob", isAuthen, async (req, res) => {
  console.log(req.body);

  const params = {
    TableName: "ApplicationJob",
    Item: {
      id: { S: uuidv4() }, // String type
      applicant_id: { S: req.body.applicant_id },
      company_id: { S: req.body.company_id},
      company_name: { S: req.body.company_name },
      job_name: { S: req.body.job_name },
      job_id: { S: req.body.job_id },
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
      message: "sendApplicationJob successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/sendApplicationProgram", isAuthen, async (req, res) => {
  console.log(req.body);

  const params = {
    TableName: "ApplicationProgram",
    Item: {
      id: { S: uuidv4() },
      applicant_id: { S: req.body.applicant_id },
      company_id: { S: req.body.company_id},
      company_name: { S: req.body.company_name },
      program_id: { S: req.body.program_id },
      program_name: { S: req.body.program_name },
      job_title: { S: req.body.job_title },
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
        message: "sendApplicationProgram successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
});
router.get("/getApplicantJob", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "ApplicationJob" });
    console.log(items);
    const ApplicationJob = items.map((item) => {
      return {
        id: item.id.S,
        applicant_id: item.applicant_id.S,
        company_name: item.company_name.S,
        company_id: item.company_id.S,
        job_name: item.job_name.S,
        job_id: item.job_id.S,
        firstName: item.firstName.S,
        lastName: item.lastName.S,
        email_profile: item.email_profile.S,
        birthDate: item.birthDate.S,
        gender: item.gender.S,
        address: item.address.S,
        phone: item.phone.S,
        resume: item.resume.S,
        transcript: item.transcript.S,
        portfolio: item.portfolio.S,
        state: item.state.S,
      };
    });
    res.status(201).json({
      items: ApplicationJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/getApplicantProgram", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "ApplicationProgram" });
    console.log(items);
    const ApplicationProgram = items.map((item) => {
      return {
        id: item.id.S,
        applicant_id: item.applicant_id.S,
        company_name: item.company_name.S,
        company_id: item.company_id.S,
        program_name: item.program_name.S,
        program_id: item.program_id.S,
        job_title: item.job_title.S,
        firstName: item.firstName.S,
        lastName: item.lastName.S,
        email_profile: item.email_profile.S,
        birthDate: item.birthDate.S,
        gender: item.gender.S,
        address: item.address.S,
        phone: item.phone.S,
        resume: item.resume.S,
        transcript: item.transcript.S,
        portfolio: item.portfolio.S,
        state: item.state.S,
      };
    });
    res.status(201).json({
      items: ApplicationProgram,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/getApplicationJobById/:id", async (req, res) => {
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

module.exports = router;
