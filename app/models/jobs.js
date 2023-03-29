const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
  jobTitle: { 
    type: String, 
    required: [true, 'Job title is required.'], 
    maxlength: [100, 'Job title cannot exceed 100 characters.']
  },
  companyName: { 
    type: String, 
    required: [true, 'Company name is required.'], 
    maxlength: [100, 'Company name cannot exceed 100 characters.']
  },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employer', 
    required: [true, 'Employer ID is required.'] 
  },
  aboutCompany: { 
    type: String, 
    maxlength: [1000, 'About company cannot exceed 1000 characters.']
  },
  jobDescription: { 
    type: String, 
    required: [true, 'Job description is required.'], 
    maxlength: [2000, 'Job description cannot exceed 2000 characters.']
  },
  responsibilities: { 
    type: String, 
    required: [true, 'Responsibilities are required.'], 
    maxlength: [2000, 'Responsibilities cannot exceed 2000 characters.']
  },
  location: { 
    type: String, 
    required: [true, 'Job location is required.'], 
    maxlength: [100, 'Location cannot exceed 100 characters.']
  },
  salary: { 
    type: Number, 
    required: [true, 'Salary is required.'], 
    min: [0, 'Salary must be a positive number.']
  },
  minimumRequirements: { 
    type: String, 
    required: [true, 'Minimum requirements are required.'], 
    maxlength: [1000, 'Minimum requirements cannot exceed 1000 characters.']
  },
  preferredRequirements: { 
    type: String, 
    maxlength: [1000, 'Preferred requirements cannot exceed 1000 characters.']
  },
  minimumQualifications: { 
    type: String, 
    required: [true, 'Minimum qualifications are required.'], 
    maxlength: [1000, 'Minimum qualifications cannot exceed 1000 characters.']
  },
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'remote', 'hybrid'], 
    required: [true, 'Job type is required.'] 
  },
  skillsRequired: [
    {
      skill: { 
        type: String, 
        required: [true, 'Skill is required.'], 
        maxlength: [100, 'Skill name cannot exceed 100 characters.']
      },
      experience: { 
        type: Number, 
        required: [true, 'Experience is required.'], 
        min: [0, 'Experience must be a positive number.']
      },
    },
  ],
  applicationDeadline: { 
    type: Date, 
    required: [true, 'Application deadline is required.'], 
    min: [Date.now(), 'Application deadline must be in the future.']
  },
  applicationInstructions: { 
    type: String, 
    required: [true, 'Application instructions are required.'], 
    maxlength: [1000, 'Application instructions cannot exceed 1000 characters.']
  },
  additionalQuestions: [
    {
      question: { 
        type: String, 
        required: [true, 'Question is required.'], 
        maxlength: [200, 'Question cannot exceed 200 characters.']
 },
      expectedAnswer: { type: String, enum: ['Yes', 'No', 'Numeric'], required: true },
    },
  ],
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'applicant',
  }],
  
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobsSchema);
