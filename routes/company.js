const express = require("express");
const router = express.Router();

router.post("/signIn", (req, res) => {
    console.log("Applicant Company")
    console.log(req.body)
  
  //ตรวจข้อมูลใน database

  //res applicant_info
  
});

router.post("/signUp", (req, res) => {
    console.log("Company SignUp")
    console.log(req.body)
    
    //database

    
  });


module.exports = router;
