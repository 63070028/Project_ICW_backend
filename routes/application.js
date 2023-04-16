const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const { putItem, scanTable, updateItem } = require("../dynamodb");


router.post("/sendApplicationJob", async (req, res) => {
    //database
    console.log(req.body);
  
    const params = {
      TableName: "ApplicationJob",
      Item: {
        id: { S: uuidv4() }, // String type
        applicant_id: {S: req.body.applicant_id},
        company_name: {S: req.body.company_name},
        job_name: {S: req.body.job_name},
        job_id: {S: req.body.job_id},
        firstName: {S: req.body.firstName},
        lastName: {S: req.body.lastName},
        email_profile: {S: req.body.email_profile},
        birthDate: {S: req.body.birthDate},
        gender: {S: req.body.gender},
        address: {S: req.body.address},
        phone: {S: req.body.phone},
        resume: {S: req.body.resume},
        transcript: {S: req.body.transcript},
        portfolio: {S: req.body.portfolio},
        state: {S: req.body.state},
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

  module.exports = router;