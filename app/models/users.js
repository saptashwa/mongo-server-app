const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  title: { type: String },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  userRole: {
    superAdmin: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    companyHR: { type: Boolean, default: false },
    clientManager: { type: Boolean, default: false },
    operationsManager: { type: Boolean, default: false }
  },
  dob: { type: Date },
  doj: { type: Date },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  location: { type: String },
  contactNumber: { type: String, required: true },
  profilePhoto: { type: String },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
