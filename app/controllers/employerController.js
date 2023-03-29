const Employer = require('../models/employers');

// Get all employers with pagination
exports.getEmployers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const employers = await Employer.find()
      .skip(startIndex)
      .limit(limit)
      .exec();
    
    const total = await Employer.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);
    const currentPage = page > totalPages ? totalPages : page;
    
    const pagination = {
      currentPage,
      totalPages,
      total,
    };
    
    res.status(200).json({ employers, pagination });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employer by id
exports.getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new employer
exports.createEmployer = async (req, res) => {
  const employer = new Employer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    company_name: req.body.company_name,
    company_address: req.body.company_address,
  });

  try {
    const newEmployer = await employer.save();
    res.status(201).json(newEmployer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update employer by id
exports.updateEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json(employer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete employer by id
exports.deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findByIdAndDelete(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }
    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
