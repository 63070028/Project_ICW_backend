const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { putItem, scanTable, updateItem, deleteItem } = require("../dynamodb");
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

router.post("/edit",upload.fields([{ name: "profile_image", maxCount: 1 },{ name: "background_image", maxCount: 1 },
]),
  async (req, res) => {
    const profileImageFile = req.files["profile_image"]?.[0];
    const backgroundImageFile = req.files["background_image"]?.[0];

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

      console.log(req.body)

      const params = {
        TableName: "company",
        Key: {
          id: { S: req.body.id },
        },
        UpdateExpression:
          "SET #n = :val1,  description = :val2, profile_image = :val3, background_image = :val4, video_iframe = :val5, #s = :val8",
        ExpressionAttributeValues: {
          ":val1": { S: req.body.name },
          ":val2": { S: req.body.description},
          ":val3": { S: profileImageUrl},
          ":val4": { S: backgroundImageUrl},
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
      job: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//editCompanyJob
router.post("/editJob", async (req, res) => {
  try {
    const params = {
      TableName: "job",
      Key: {
        id: { S: req.body.id },
      },
      UpdateExpression:
        "SET #n = :name, #c = :capacity, #l = :location, detail = :detail, interview = :interview, salary_per_day = :salary_per_day, #s = :state, qualifications = :q",
      ExpressionAttributeValues: {
        ":name": { S: req.body.name },
        ":capacity": { N: req.body.capacity.toString()},
        ":location": { S: req.body.location },
        ":detail": { S: req.body.detail },
        ":interview": { S: req.body.interview },
        ":salary_per_day": { N: req.body.salary_per_day.toString() },
        ":state": { S: req.body.state },
        ":q": { SS: req.body.qualifications.filter((value, index, self) => self.indexOf(value) === index) },
      },
      ExpressionAttributeNames: {
        "#s": "state",
        "#n": "name",
        "#c": "capacity",
        "#l": "location",
      },
      ReturnValues: "ALL_NEW",
    };

    await updateItem(params);
    res.status(201).json({
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

//AddJob
router.post("/addJob", async (req, res) => {
  console.log(req.body)
  try {
    
    // const qualifications_arr = req.body.qualifications.split(',').map(item => item.trim())
    const params = {
      TableName: "job",
      Item: {
        id: { S: uuidv4() },
        capacity: { N: req.body.capacity.toString() },
        company_name: { S: req.body.company_name },
        company_id: { S: req.body.company_id },
        creation_date: { S: new Date().toISOString() },
        detail: { S: req.body.detail },
        interview: { S: req.body.interview },
        location: { S: req.body.location },
        name: { S: req.body.name },
        salary_per_day: { N: req.body.salary_per_day.toString() },
        contact: {
          M: {
            name: { S: req.body.contact.name },
            email: { S: req.body.contact.email },
            phone: { S: req.body.contact.phone },
          },
        },
        qualifications: {
          SS:req.body.qualifications,},
        state: { S: req.body.state },
      },
    };

    await putItem(params);
    res.status(201).json({
      message: "Job added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


// Delete a job
router.delete("/deleteJob", async (req, res) => {
  const { jobId } = req.query;

  const params = {
    TableName: "job",
    Key: {
      id: { S: jobId },
    },
  };

  try {
    await deleteItem(params);
    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

//getJobById
router.post("/getJobById", async (req, res) => {
  try {
    const items = await scanTable({ TableName: "job" });
    const job_t = items.find((item) => item.id.S == req.body.job_id);

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

    const jobFavorite = await scanTable({ TableName: "JobFavorite" });
    let isJobFavorite = jobFavorite.find(
      (job) =>
        job.applicant_id.S == req.body.applicant_id &&
        job.job_id.S == req.body.job_id
    );
    isJobFavorite = !isJobFavorite ? false : true;

    res.status(201).json({
      job: job,
      isJobFavorite: isJobFavorite,
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


//getPrograms
router.get("/getProgram/:id", async (req, res) => {
  try {
    const items = await scanTable({ TableName: "program" });
    const program_table = items.filter((item) => item.company_id.S == req.params.id
    );
    const programs = program_table.map((item) => {
      return {
        id: item.id.S,
        company_id:item.company_id.S,
        company_name: item.company_name.S,
        image: item.image.S,
        name: item.name.S,
        description: item.description.S,
        course: item.course.S,
        jobs_title: item.jobs_title.SS,
        qualifications: item.qualifications.SS,
        privileges: item.privileges.SS,
        state: item.state?.S,
      };
    });
    res.status(201).json({
      program: programs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//addProgram
router.post("/addProgram", upload.single("image"), async (req, res) => {
  try {
    const fileName = `ProgramImage-${uuidv4()}-${req.file.originalname}`;
    const folderS3 = "images";
    const imageUrl = await uploadToS3(
      `${process.env.S3_BUCKET}`,
      fileName,
      folderS3,
      req.file
    );
    const jobs_title_arr = req.body.jobs_title.split(',').map(item => item.trim());
    const qualifications_arr = req.body.qualifications.split(',').map(item => item.trim());
    const privileges_arr = req.body.privileges.split(',').map(item => item.trim());
    console.log("all", req.body)
    const params = {
      TableName: "program",
      Item: {
        id: { S: uuidv4() },
        company_id: { S: req.body.company_id },
        company_name: { S: req.body.company_name },
        image: { S: imageUrl },
        name: { S: req.body.name },
        description: { S: req.body.description },
        course: { S: req.body.course },
        jobs_title: { SS: jobs_title_arr},
        qualifications: { SS: qualifications_arr},
        privileges: { SS: privileges_arr},
        state: { S: req.body.state },
      },
    };
    console.log(params);
    await putItem(params);
    
    res.status(201).json({
      image:imageUrl,
      message: "Program added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

//edit and update Program
router.post("/editProgram", upload.single("image"), async (req, res) => {
  try {
    const fileName = `ProgramImage-${uuidv4()}-${req.file.originalname}`;
    const folderS3 = "images";
    const imageUrl = await uploadToS3(
      `${process.env.S3_BUCKET}`,
      fileName,
      folderS3,
      req.file
    );
    const jobs_title_arr = req.body.jobs_title.split(",").map((item) => item.trim());
    const qualifications_arr = req.body.qualifications.split(",").map((item) => item.trim());
    const privileges_arr = req.body.privileges.split(",").map((item) => item.trim());

    const params = {
      TableName: "program",
      Key: {
        id: { S: req.body.id },
      },
      UpdateExpression: "SET #n = :name, jobs_title = :jobs_title, description = :description, course = :course, qualifications = :qualifications, #p = :privileges, #s = :state, image = :image",
      ExpressionAttributeValues: {
        ":name": { S: req.body.name },
        ":jobs_title": { SS: jobs_title_arr },
        ":description": { S: req.body.description },
        ":course": { S: req.body.course },
        ":qualifications": { SS: qualifications_arr },
        ":privileges": { SS: privileges_arr },
        ":state": { S: req.body.state },
        ":image": { S: imageUrl },
      },
      ExpressionAttributeNames:{
          "#s": "state",
          "#n": "name",
          "#p": "privileges"
      },
      ReturnValues: "ALL_NEW",
    };
      console.log(params);
      await updateItem(params);
      res.status(201).json({
        image:imageUrl,
        message: "Program added successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
});

router.post("/getProgramById", async (req, res) => {
  try {
    const items = await scanTable({ TableName: "program" });
    const program_t = items.find((item) => item.id.S == req.body.program_id);

    const program = {
      id: program_t.id.S,
      company_id: program_t.company_id.S,
      company_name: program_t.company_name.S,
      image: program_t.image.S,
      name: program_t.name.S,
      description: program_t.description.S,
      course: program_t.course.S,
      jobs_title: program_t.jobs_title.SS,
      qualifications: program_t.qualifications.SS,
      privileges: program_t.privileges.SS,
      state: program_t.state.S,
    };

    res.status(201).json({
      program: program,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/deleteProgram", async (req, res) => {
  const { programId } = req.query;

  const params = {
    TableName: "program",
    Key: {
      id: { S: programId },
    },
  };

  try {
    await deleteItem(params);
    res.status(200).json({
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/setProgramState", async (req, res) => {
  console.log(req.body);
  const params = {
    TableName: "program",
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


router.get("/getCompanyStateon", async (req, res) => {
  try {
    const items = await scanTable({ TableName: "company" });
    console.log(items);
    const company_all = items.map((item) => {
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

    const conpany_state_on = company_all.filter(company =>  company.state === 'on')
    console.log(conpany_state_on)
    res.status(201).json(conpany_state_on);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/getProgram", async (req, res) => {
  try {
    const items = await scanTable({ TableName: "program" });
    const program = items.map(program_t => {
      return {
        id: program_t.id.S,
        company_id: program_t.company_id.S,
        company_name: program_t.company_name.S,
        image: program_t.image.S,
        name: program_t.name.S,
        description: program_t.description.S,
        course: program_t.course.S,
        jobs_title: program_t.jobs_title.SS,
        qualifications: program_t.qualifications.SS,
        privileges: program_t.privileges.SS,
        state: program_t.state.S,
      };
    })

    res.status(201).json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
