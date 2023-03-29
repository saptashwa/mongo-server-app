const JobSeeker = require('../models/jobSeeker');
const Recruiter = require('../models/recruiter');
const Employer = require('../models/employer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

// Middleware function to verify email and mobile number during jobseeker registration
exports.jobSeekerRegistrationMiddleware = async (req, res, next) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ email: req.body.email });
    if (jobSeeker) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const jobSeekerMobile = await JobSeeker.findOne({ mobile: req.body.mobile });
    if (jobSeekerMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while validating job seeker registration' });
  }
};

// Middleware function to verify email and mobile number during recruiter registration
exports.recruiterRegistrationMiddleware = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.body.email });
    if (recruiter) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const recruiterMobile = await Recruiter.findOne({ mobile: req.body.mobile });
    if (recruiterMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while validating recruiter registration' });
  }
};

// Middleware function to verify email and mobile number during employer registration
exports.employerRegistrationMiddleware = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ email: req.body.email });
    if (employer) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const employerMobile = await Employer.findOne({ mobile: req.body.mobile });
    if (employerMobile) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while validating employer registration' });
  }
};

// Middleware function to send verification email during registration
exports.sendVerificationEmail = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const token = jwt.sign(
      { email: req.body.email, mobile: req.body.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Verify Your Email',
      html: `
        <p>Please click on the following link to verify your email address:</p>
        <p>${process.env.CLIENT_URL}/verify-email?token=${token}</p>
        <br />
        <p>Note: This link will expire in 24 hours.</p>
        `,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification email has been sent. Please check your email.' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while sending verification email' });
        }
        };
        
        // Verify email
        exports.verifyEmail = async (req, res) => {
        try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: 'Invalid token. Please try again.' });
          }
          
          const user = await User.findOne({ emailVerificationToken: token });
          
          if (!user) {
            return res.status(400).json({ error: 'Invalid token. Please try again.' });
          }
          
          user.emailVerificationToken = undefined;
          user.emailVerificationExpires = undefined;
          user.isEmailVerified = true;
          
          await user.save();
          
          res.status(200).json({ message: 'Email verified successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error while verifying email' });
            }
            };
            
            // Verify mobile number
            exports.verifyMobileNumber = async (req, res) => {
            try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({ error: 'Invalid token. Please try again.' });
              }
              
              const user = await User.findOne({ mobileVerificationToken: token });
              
              if (!user) {
                return res.status(400).json({ error: 'Invalid token. Please try again.' });
              }
              
              user.mobileVerificationToken = undefined;
              user.mobileVerificationExpires = undefined;
              user.isMobileVerified = true;
              
              await user.save();
              
              res.status(200).json({ message: 'Mobile number verified successfully.' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Server error while verifying mobile number' });
                }
                };
                
                // Middleware function for job seeker registration
exports.jobSeekerRegistration = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, mobileNumber } = req.body;
  
      // Check if user with given email or mobile number already exists
      const existingUser = await JobSeeker.findOne({ $or: [{ email }, { mobileNumber }] });
      if (existingUser) {
        return res.status(409).json({ message: "User with this email or mobile number already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new job seeker user
      const jobSeeker = new JobSeeker({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        mobileNumber
      });
  
      // Generate email verification token and save to user
      const emailVerificationToken = crypto.randomBytes(20).toString("hex");
      const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
      jobSeeker.emailVerificationToken = emailVerificationToken;
      jobSeeker.emailVerificationExpires = emailVerificationExpires;
  
      // Generate mobile verification token and save to user
      const mobileVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      const mobileVerificationExpires = Date.now() + 10 * 60 * 1000;
      jobSeeker.mobileVerificationToken = mobileVerificationToken;
      jobSeeker.mobileVerificationExpires = mobileVerificationExpires;
  
      // Save job seeker user to database
      const savedJobSeeker = await jobSeeker.save();
  
      // Send email verification email to user
      const emailVerificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
      await sendVerificationEmail(savedJobSeeker.email, savedJobSeeker.firstName, emailVerificationUrl);
  
      // Send mobile verification SMS to user
      const mobileVerificationMessage = `Your verification code is ${mobileVerificationToken}`;
      await sendVerificationSMS(savedJobSeeker.mobileNumber, mobileVerificationMessage);
  
      // Send response
      res.status(201).json({ message: "Job seeker user created successfully" });
    } catch (error) {
      next(error);
    }
  };
  