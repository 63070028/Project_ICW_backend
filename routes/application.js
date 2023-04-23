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
      creation_date: {S: req.body.creation_date},
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
      creation_date: {S: req.body.creation_date},
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

//Kong: แก้ขื่อ + fitter company_id

router.get("/getApplicationJobsByCompanyId/:id", isAuthen, async (req, res) => {
  console.log(req.params.id)
  try {
    const applicationJobs = await scanTable({ TableName: "ApplicationJob" });
    const myApplicationJobs_t = applicationJobs.filter((item) => item.company_id.S == req.params.id);

   const myApplicationJobs = myApplicationJobs_t.map((item)=>{
    return {
      id: item.id.S,
      applicant_id: item.applicant_id.S,
      company_id: item.company_id.S,
      company_name: item.company_name.S,
      job_name: item.job_name.S,
      job_id: item.job_id.S,
      firstName: item.firstName.S,
      lastName: item.lastName.S,
      email_profile: item.email_profile.S,
      birthDate: item.birthDate.S,
      gender: item.gender.S,
      address: item.address.S,
      phone: item.phone.S,
      resume: item.phone.S,
      transcript: item.transcript.S,
      portfolio: item.portfolio.S,
      creation_date: item.creation_date,
      state: item.state.S,
      }
   })

    res.status(201).json(myApplicationJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getApplicationProgramsByCompanyId/:id", isAuthen, async (req, res) => {
  console.log(req.params.id)
  try {
    const applicationPrograms = await scanTable({ TableName: "ApplicationProgram" });
    const myApplicationPrograms_t = applicationPrograms.filter((item) => item.company_id.S == req.params.id);

   const myApplicationPrograms = myApplicationPrograms_t.map((item)=>{
    return  {
      id: item.id.S,
      applicant_id: item.applicant_id.S,
      company_id: item.company_id.S,
      company_name: item.company_name.S,
      program_id: item.program_id.S,
      program_name: item.program_name.S,
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
      creation_date: item.creation_date,
      state: item.state.S,
    }
   })

    res.status(201).json(myApplicationPrograms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getApplicationJobsByApplicantId/:id", isAuthen, async (req, res) => {
  console.log(req.params.id)
  try {
    const applicationJobs = await scanTable({ TableName: "ApplicationJob" });
    const myApplicationJobs_t = applicationJobs.filter((item) => item.applicant_id.S == req.params.id);

   const myApplicationJobs = myApplicationJobs_t.map((item)=>{
    return {
      id: item.id.S,
      applicant_id: item.applicant_id.S,
      company_id: item.company_id.S,
      company_name: item.company_name.S,
      job_name: item.job_name.S,
      job_id: item.job_id.S,
      firstName: item.firstName.S,
      lastName: item.lastName.S,
      email_profile: item.email_profile.S,
      birthDate: item.birthDate.S,
      gender: item.gender.S,
      address: item.address.S,
      phone: item.phone.S,
      resume: item.phone.S,
      transcript: item.transcript.S,
      portfolio: item.portfolio.S,
      creation_date: item.creation_date.S,
      state: item.state.S,
      }
   })

    res.status(201).json(myApplicationJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getApplicationProgramsByApplicantId/:id", isAuthen, async (req, res) => {
  console.log(req.params.id)
  try {
    const applicationPrograms = await scanTable({ TableName: "ApplicationProgram" });
    const myApplicationPrograms_t = applicationPrograms.filter((item) => item.applicant_id.S == req.params.id);

   const myApplicationPrograms = myApplicationPrograms_t.map((item)=>{
    return  {
      id: item.id.S,
      applicant_id: item.applicant_id.S,
      company_id: item.company_id.S,
      company_name: item.company_name.S,
      program_id: item.program_id.S,
      program_name: item.program_name.S,
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
      creation_date: item.creation_date.S,
      state: item.state.S,
    }
   })

    res.status(201).json(myApplicationPrograms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/setApplicationJobState",isAuthen, async (req, res) => {
  console.log(req.body);
  const params = {
    TableName: "ApplicationJob",
    Key: {
      id: { S: req.body.id },
    },
    UpdateExpression: "SET #s = :val1",
    ExpressionAttributeValues: {
      ":val1": { S: req.body.state },
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
})

router.post("/setApplicationProgramState",isAuthen, async (req, res) => {
  console.log(req.body);
  const params = {
    TableName: "ApplicationProgram",
    Key: {
      id: { S: req.body.id },
    },
    UpdateExpression: "SET #s = :val1",
    ExpressionAttributeValues: {
      ":val1": { S: req.body.state },
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
})



module.exports = router;
