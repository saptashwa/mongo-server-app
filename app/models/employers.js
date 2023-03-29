const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  employerName: {
    type: String,
    unique: true,
    required: true
  },
  yearOfFoundation: {
    type: Date
  },
  aboutCompany: {
    type: String,
    required: true,
    minlength: 100
  },
  employerId: {
    type: String,
    unique: true,
    required: true
  },
  contactPersonName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 8,
    maxlength: 16,
    validate: {
      validator: function(v) {
        return /^[a-z0-9]+$|^[A-Z0-9]+$|^[0-9]+$/.test(v);
      },
      message: "Username must be either all lowercase, all uppercase, or all digits."
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 16
  },
  jobseekers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'jobseekers',
      select: '-phone -contactNumber -email'
    }
  ],
  recruiters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'recruiters',
      select: '-phone -contactNumber -email'
    }
  ]
});

module.exports = mongoose.model('employers', employerSchema);
