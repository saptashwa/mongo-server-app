const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const jobSeekerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  full_name: { type: String, required: true },
  dob: {
    type: Date,
    required: true,
    validate: [
      function (dob) {
        return this.full_name !== this.dob.toISOString().substring(0, 10);
      },
      'Full name and Date of Birth cannot be same'
    ]
  },
  email: { type: String, unique: true, required: true },
  contact_number: { type: String, unique: true, required: true },
  current_city: { type: String, required: true },
  educational_details: [{
    degree_name: { type: String, required: true },
    year_of_passout: { type: String, required: true },
    college_university_name: { type: String, required: true }
  }],
  experience_details: [{
    organization_name: { type: String, required: true },
    designation: { type: String, required: true },
    responsibilities: { type: String, required: true },
    joining_date: { type: Date, required: true },
    relieving_date: { type: Date, default: null },
    currently_working: { type: Boolean, default: false }
  }],
  total_experience: {
    type: String,
    required: function () {
      return this.experience_details.some(function (exp) {
        return !exp.currently_working;
      });
    },
    validate: [
      function (exp) {
        const pattern = /^\d{2}\/\d{2}$/;
        return pattern.test(exp);
      },
      'Experience should be in yy/mm format'
    ]
  },
  skills_expertise: [{
    skill_name: { type: String, required: true },
    experience: { type: String, required: true }
  }],
  open_to_relocate: { type: Boolean, required: true },
  open_for_remote_work: { type: Boolean, required: true },
  open_to_byod: { type: Boolean, required: true },
  current_ctc: {
    ctc: { type: Number },
    is_current: { type: Boolean }
  },
  min_acceptable_ctc: { type: Number, required: true },
  cv: {
    filename: { type: String, required: true },
    path: { type: String, required: true }
  },
  open_for_international_job_offers: { type: Boolean, required: true },
  passport_available: { type: Boolean, required: true },
  passport_validity: {
    type: Date,
    validate: [
      function () {
        return this.passport_available;
      },
      'Passport validity should be provided if Passport is available'
    ]
  },
  referral: { type: Boolean, required: true },
  referral_id: {
    type: String,
    validate: {
      validator: async function (v) {
        if (!this.referral) {
          return true;
        }
        const count = await mongoose.model('Recruiter').countDocuments({ referral_id: v });
        return count === 1;
      },
      message: 'No Referral found'
    }
  }
}, { timestamps: true });

const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);

module.exports = JobSeeker;
