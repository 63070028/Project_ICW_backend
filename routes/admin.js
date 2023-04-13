const express = require("express");
const router = express.Router();

const { putItem, scanTable } = require("../dynamodb");

router.get("/getReportJob" , async (req, res) => {
    
    try{
        console.log("test")
        const items = await scanTable({ TableName: "JobReport" });
        console.log(items)
        const jobReport = items.map((item) => {
            return { message: item.message.S,
            job_id: item.job_id.S,
            user_id: item.user_id.S,
            creation_date: item.creation_date.S }
        })
        res.status(201).json({
            items: jobReport
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }



})
module.exports = router;
