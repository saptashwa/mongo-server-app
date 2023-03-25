const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
  full_name: {
    first: { type: String, required: true },
    last: { type: String, required: true }
  },
  email: { type: String, unique: true, required: true },
  phone_number: { type: String, unique: true, required: true },
  date_of_birth: { type: Date, required: true },
  referral_id: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  alternate_number: { type: String },
  profile_photo: { type: String },
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  employers: [{ type: Schema.Types.ObjectId, ref: 'Employer' }],
  job_seekers: [{
    id: { type: Schema.Types.ObjectId, ref: 'JobSeeker' },
    status: { type: String, enum: ['referred', 'viewed', 'modified'], default: 'referred' },
    date_referred: { type: Date, default: Date.now },
    date_modified: { type: Date, default: null }
  }]
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
