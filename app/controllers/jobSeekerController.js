const JobSeeker = require('../models/jobseekers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const createJobSeeker = async (req, res) => {
  // Validate user input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the job seeker already exists
    let jobSeeker = await JobSeeker.findOne({ email });

    if (jobSeeker) {
      return res.status(400).json({ msg: 'Job Seeker already exists' });
    }

    // Create a new job seeker
    jobSeeker = new JobSeeker({
      firstName,
      lastName,
      email,
      password,
    });

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    jobSeeker.password = await bcrypt.hash(password, salt);

    await jobSeeker.save();

    // Generate a JWT token for the job seeker
    const payload = {
      jobSeeker: {
        id: jobSeeker.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getJobSeekerProfile = async (req, res) => {
  try {
    // Find the job seeker by ID
    const jobSeeker = await JobSeeker.findById(req.jobSeeker.id).select(
      '-password'
    );

    if (!jobSeeker) {
      return res.status(404).json({ msg: 'Job Seeker not found' });
    }

    res.json(jobSeeker);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job Seeker not found' });
    }

    res.status(500).send('Server Error');
  }
};

module.exports = { createJobSeeker, getJobSeekerProfile };
