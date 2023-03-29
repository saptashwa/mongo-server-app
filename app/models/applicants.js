const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
  },
  currentCompany: {
    type: String,
    required: true,
  },
  highestQualification: {
    type: String,
    required: true,
  },
  linkedinProfile: {
    type: String,
    required: true,
  },
  expectedCTC: {
    type: Number,
    required: true,
  },
  currentCTC: {
    type: Number,
    required: true,
  },
  noticePeriod: {
    type: Number,
    required: true,
  },
  totalExperience: {
    type: Number,
    required: true,
  },
  skills: [{
    name: String,
    experience: Number,
  }],
  customQuestions: [{
    question: String,
    answer: String,
  }],
  resume: [{
    fileName: String,
    filePath: String,
  }],
  comments: {
    type: String,
    default: "",
  },
  referralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
