const express = require("express");
const router = express.Router();
const jobSeekerController = require("../controllers/jobSeekerController");
// const authMiddleware = require("../middlewares/authMiddleware");
// const roleMiddleware = require("../middlewares/roleMiddleware");

// Public routes
// router.post("/register", jobSeekerController.register);
// router.post("/login", jobSeekerController.login);

// Private routes
// router.use(authMiddleware);

// Job Seeker CRUD operations
router.get("/", jobSeekerController.getJobSeekerProfile);
// router.put("/", roleMiddleware("jobseeker"), jobSeekerController.updateJobSeekerProfile);
// router.delete("/", roleMiddleware("jobseeker"), jobSeekerController.deleteJobSeekerProfile);

// Apply to Job operation
// router.post("/:jobId/apply", roleMiddleware("jobseeker"), jobSeekerController.applyToJob);

module.exports = router;
