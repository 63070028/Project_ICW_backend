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

router.get("/getApplicationJobDetailById/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const applicationJobs = await scanTable({ TableName: "ApplicationJob" });
    const myApplicationJobs_t = applicationJobs.find((item) => item.id.S == req.params.id);
    const myApplicationJobs = {
      id: myApplicationJobs_t.id.S,
      applicant_id: myApplicationJobs_t.applicant_id.S,
      company_id: myApplicationJobs_t.company_id.S,
      company_name: myApplicationJobs_t.company_name.S,
      job_name: myApplicationJobs_t.job_name.S,
      job_id: myApplicationJobs_t.job_id.S,
      firstName: myApplicationJobs_t.firstName.S,
      lastName: myApplicationJobs_t.lastName.S,
      email_profile: myApplicationJobs_t.email_profile.S,
      birthDate: myApplicationJobs_t.birthDate.S,
      gender: myApplicationJobs_t.gender.S,
      address: myApplicationJobs_t.address.S,
      phone: myApplicationJobs_t.phone.S,
      resume: myApplicationJobs_t.phone.S,
      transcript: myApplicationJobs_t.transcript.S,
      portfolio: myApplicationJobs_t.portfolio.S,
      creation_date: myApplicationJobs_t.creation_date,
      state: myApplicationJobs_t.state.S,
    }
   console.log(myApplicationJobs)
   res.status(201).json({
    applicantJob: myApplicationJobs,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/acceptApplicationJob",  async (req, res) => {
  console.log(req.body)

  const params = {
    TableName: "ApplicationJob",
    Key: {
      "id": { "S":  req.body.id }
    },
    UpdateExpression: "SET #s = :val8",
    ExpressionAttributeValues: {
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
      message: "updateState successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/declineApplicationJob",  async (req, res) => {
  console.log(req.body)

  const params = {
    TableName: "ApplicationJob",
    Key: {
      "id": { "S":  req.body.id }
    },
    UpdateExpression: "SET #s = :val8",
    ExpressionAttributeValues: {
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
      message: "updateState successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.get("/getApplicationProgramDetailById/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const applicationPrograms = await scanTable({ TableName: "ApplicationProgram" });
    const myApplicationPrograms_t = applicationPrograms.find((item) => item.id.S == req.params.id);
    const myApplicationPrograms = {
      id: myApplicationPrograms_t.id.S,
      applicant_id: myApplicationPrograms_t.applicant_id.S,
      company_id: myApplicationPrograms_t.company_id.S,
      company_name: myApplicationPrograms_t.company_name.S,
      program_id: myApplicationPrograms_t.program_id.S,
      program_name: myApplicationPrograms_t.program_name.S,
      job_title: myApplicationPrograms_t.job_title.S,
      firstName: myApplicationPrograms_t.firstName.S,
      lastName: myApplicationPrograms_t.lastName.S,
      email_profile: myApplicationPrograms_t.email_profile.S,
      birthDate: myApplicationPrograms_t.birthDate.S,
      gender: myApplicationPrograms_t.gender.S,
      address: myApplicationPrograms_t.address.S,
      phone: myApplicationPrograms_t.phone.S,
      resume: myApplicationPrograms_t.resume.S,
      transcript: myApplicationPrograms_t.transcript.S,
      portfolio: myApplicationPrograms_t.portfolio.S,
      creation_date: myApplicationPrograms_t.creation_date.S,
      state: myApplicationPrograms_t.state.S,
    }
   console.log(myApplicationPrograms)
   res.status(201).json({
    applicantProgram: myApplicationPrograms,
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/acceptApplicationProgram",  async (req, res) => {
  console.log(req.body)

  const params = {
    TableName: "ApplicationProgram",
    Key: {
      "id": { "S":  req.body.id }
    },
    UpdateExpression: "SET #s = :val8",
    ExpressionAttributeValues: {
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
      message: "updateState successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/declineApplicationProgram",  async (req, res) => {
  console.log(req.body)

  const params = {
    TableName: "ApplicationProgram",
    Key: {
      "id": { "S":  req.body.id }
    },
    UpdateExpression: "SET #s = :val8",
    ExpressionAttributeValues: {
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
      message: "updateState successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
