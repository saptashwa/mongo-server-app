const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
// router.post('/register', recruiterController.register);
// router.post('/login', recruiterController.login);

// Private routes
// router.use(authMiddleware.authenticateToken);

router.get('/', recruiterController.getAllRecruiters);
router.get('/:id', recruiterController.getRecruiterById);
// router.put('/:id', recruiterController.updateRecruiter);
// router.delete('/:id', recruiterController.deleteRecruiter);

module.exports = router;
