const express = require("express");
const router = express.Router();
const isAuthen = require("../middleware/isAuthen");

const { scanTable, putItem, updateItem } = require("../dynamodb");

router.get("/getReportJob", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "JobReport" });
    console.log(items);
    const jobReport = items.map((item) => {
      return {
        message: item.message.S,
        job_id: item.job_id.S,
        company_id: item.company_id.S,
        company_name: item.company_name.S,
        job_name: item.job_name.S,
        user_id: item.user_id.S,
        creation_date: item.creation_date.S,
      };
    });
    res.status(201).json({
      items: jobReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/getCompany", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "company" });
    console.log(items);
    const Company = items.map((item) => {
      return {
        id: item.id.S,
        name: item.name.S,
        description: item.description.S,
        profile_image: item.profile_image.S,
        background_image: item.background_image.S,
        video_iframe: item.video_iframe.S,
        state: item.state.S,
      };
    });
    res.status(201).json({
      items: Company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getCompanyJob", async (req, res) => {
  try {
    console.log("test");
    const items = await scanTable({ TableName: "job" });
    console.log(items);

    const Job = items.map((item) => {
      return {
        id: item.id.S,
        company_id: item.company_id.S,
        name: item.name.S,
        salary_per_day: item.salary_per_day.N,
        location: item.location.S,
        capacity: item.capacity.N,
        detail: item.detail.S,
        interview: item.interview.S,
        qualifications: item.qualifications.SS,
        contact: item.contact,
        creation_date: item.creation_date.S,
        state: item.state.S,
      };
    });
    res.status(201).json({
      items: Job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
