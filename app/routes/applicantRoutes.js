const express = require('express');
const router = express.Router();

const ApplicantsController = require('../controllers/applicantController');

router.post('/applicants/create', ApplicantsController.createApplicant);
router.get('/applicants/:id', ApplicantsController.getApplicantById);

module.exports = router;
