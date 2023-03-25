const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get job by id
router.get('/:id',jobController.getJobById);

// Create a new job
router.post('/', jobController.createJob);

// Update job by id
router.put('/:id',  jobController.updateJobById);

// Delete job by id
router.delete('/:id', jobController.deleteJobById);

// Apply for job
// router.post('/:id/apply', authMiddleware.authenticateToken , jobsController.applyForJob);

// Refer Candidate for job
// router.post('/:id/refer', authMiddleware.authenticateToken , jobsController.referCandidate);

module.exports = router;
