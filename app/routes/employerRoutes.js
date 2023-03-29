const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateEmployer } = require('../middlewares/validationMiddleware');

// Public endpoints
// router.post('/employers/signup', validateEmployer, employerController.signup);
// router.post('/employers/login', employerController.login);

// Protected endpoints
// router.use(authMiddleware.authenticateToken);
// router.get('/employers/profile', employerController.getProfile);
// router.put('/employers/profile', validateEmployer, employerController.updateProfile);
// router.post('/jobs', employerController.createJob);
// router.get('/jobs', employerController.getAllJobs);
// router.get('/jobs/:id', employerController.getJobById);
// router.put('/jobs/:id', employerController.updateJobById);
// router.delete('/jobs/:id', employerController.deleteJobById);

module.exports = router;
