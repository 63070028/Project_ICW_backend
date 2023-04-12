const express = require('express')
require('dotenv').config(); //ใข้งาน .env
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//middleware
const logger = require('./middleware/logger');

app.use(logger);

app.use('/applicant', require('./routes/applicant'))
app.use('/company', require('./routes/company'))




const port = `${process.env.PORT}`;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
