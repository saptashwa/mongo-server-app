const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const database = require('./config/database');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// connect to MongoDB


// define routes
const userRoutes = require('./routes/userRoutes');
const employerRoutes = require('./routes/employerRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobseekerRoutes = require('./routes/jobseekerRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');

app.use('/api/users', userRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/jobseekers', jobseekerRoutes);
app.use('/api/recruiters', recruiterRoutes);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  database.start();
  console.log(`Server listening on port ${port}`);
});
