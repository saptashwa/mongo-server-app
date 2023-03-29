const Job = require('../models/jobs');
const Employer = require('../models/employers');
const Applicant = require('../models/applicants');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const employer = await Employer.findOne({ name: req.body.companyName });
    if (!employer) {
      const newEmployer = await Employer.create({ name: req.body.companyName });
      req.body.companyId = newEmployer._id;
      req.body.aboutCompany = newEmployer.about;
    } else {
      req.body.companyId = employer._id;
      req.body.aboutCompany = employer.about;
    }

    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating job' });
  }
};

// Get all jobs with pagination
exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const jobs = await Job.find().populate('companyId').skip(startIndex).limit(limit);
    const totalCount = await Job.countDocuments();

    const pagination = {
      total: totalCount,
      limit: limit,
      page: page,
      pages: Math.ceil(totalCount / limit),
    };

    if (endIndex < totalCount) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.status(200).json({ pagination, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while getting jobs' });
  }
};

// Get a single job by id
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while getting job' });
  }
};

// Update a job by id
exports.updateJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('companyId');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating job' });
  }
};

// Delete a job by id
exports.deleteJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting job' });
  }
};

// Search jobs by location, jobTitle, and companyName
exports.searchJobs = async (req, res) => {
    try {
      const location = req.query.location || '';
      const jobTitle = req.query.jobTitle || '';
      const companyName = req.query.companyName || '';
  
      const jobs = await Job.find({
        location: { $regex: new RegExp(location, 'i') },
        jobTitle: { $regex: new RegExp(jobTitle, 'i') },
        'companyId.name': { $regex: new RegExp(companyName, 'i') },
      }).populate('companyId');
  
      res.status(200).json(jobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while searching for jobs' });
    }
  };
  
  // Apply for a job
  exports.applyForJob = async (req, res) => {
    try {
      const job = await Job.findById(req.params.id).populate('companyId');
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      // Check if applicant already applied for the job
      const alreadyApplied = job.applicants.some(
        (applicant) => applicant.email === req.body.email
      );
      if (alreadyApplied) {
        return res.status(400).json({ error: 'You have already applied for this job' });
      }
  
      job.applicants.push(req.body);
      await job.save();
  
      res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while applying for job' });
    }
  };
  
// Method to add applicant to job and update job details
exports.applyForJob = async (req, res) => {
  try {
    const { applicantId } = req.body;
    const { id } = req.params;

    // Check if applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    // Check if job exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if applicant has already applied for the job
    if (job.applicants.includes(applicantId)) {
      return res.status(400).json({ success: false, message: 'Applicant has already applied for this job' });
    }

    // Add applicant to job and update job details
    job.applicants.push(applicantId);
    await job.save();

    return res.status(200).json({ success: true, message: 'Applicant applied successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Method to refer a candidate for a job
exports.referCandidate = async (req, res) => {
  try {
    const { applicantId, referralId } = req.body;
    const { id } = req.params;

    // Check if applicant exists
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    // Check if job exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if applicant has already applied for the job
    if (job.applicants.includes(applicantId)) {
      return res.status(400).json({ success: false, message: 'Applicant has already applied for this job' });
    }

    // Add applicant to job with referral id and update job details
    job.applicants.push({ applicantId, referralId });
    await job.save();

    return res.status(200).json({ success: true, message: 'Applicant referred successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
