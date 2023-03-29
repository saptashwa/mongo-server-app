const Recruiter = require('../models/recruiters');
const User = require('../models/users');
const Job = require('../models/jobs');
const { validationResult } = require('express-validator');

// Create a new recruiter
exports.createRecruiter = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create a new user
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    role: 'recruiter',
  });

  // Save the user
  await user.save();

  // Create a new recruiter
  const recruiter = new Recruiter({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    user: user._id,
  });

  // Save the recruiter
  await recruiter.save();

  res.status(201).json({ recruiter });
};

// Get all recruiters
exports.getAllRecruiters = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    
    try {
      const recruiters = await Recruiter.find()
        .populate('user', '-password')
        .skip(skipIndex)
        .limit(limit);
        
      const totalCount = await Recruiter.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);
        
      res.status(200).json({
        recruiters,
        totalPages,
        currentPage: page,
        totalCount
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };  

// Get a recruiter by ID
exports.getRecruiterById = async (req, res) => {
  const recruiter = await Recruiter.findById(req.params.id).populate('user', '-password');
  if (!recruiter) {
    return res.status(404).json({ message: 'Recruiter not found' });
  }
  res.status(200).json({ recruiter });
};

// Update a recruiter by ID
exports.updateRecruiterById = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const recruiter = await Recruiter.findById(req.params.id);
  if (!recruiter) {
    return res.status(404).json({ message: 'Recruiter not found' });
  }

  const user = await User.findById(recruiter.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update user
  user.email = req.body.email;
  user.password = req.body.password;
  await user.save();

  // Update recruiter
  recruiter.firstName = req.body.firstName;
  recruiter.lastName = req.body.lastName;
  recruiter.phone = req.body.phone;
  await recruiter.save();

  res.status(200).json({ recruiter });
};

// Delete a recruiter by ID
exports.deleteRecruiterById = async (req, res) => {
  const recruiter = await Recruiter.findById(req.params.id);
  if (!recruiter) {
    return res.status(404).json({ message: 'Recruiter not found' });
  }

  const user = await User.findByIdAndDelete(recruiter.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Delete jobs associated with the recruiter
  await Job.deleteMany({ recruiter: recruiter._id });

  // Delete the recruiter
  await Recruiter.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Recruiter deleted successfully' });
};
