const Applicant = require('../models/applicants');

const createApplicant = async (req, res) => {
  try {
    const {
      email,
      fullName,
      mobileNumber,
      currentLocation,
      currentCompany,
      highestQualification,
      linkedinProfile,
      expectedCTC,
      currentCTC,
      noticePeriod,
      totalExperience,
      skills,
      customQuestions,
      resume,
      comments,
      referralId,
    } = req.body;

    // Check if applicant already exists with the given email and referral id
    const existingApplicant = await Applicant.findOne({
      email,
      referralId,
    });

    if (existingApplicant) {
      return res.status(400).json({
        message: 'Applicant already exists with the given email and referral id',
      });
    }

    // Create new applicant object
    const newApplicant = new Applicant({
      email,
      fullName,
      mobileNumber,
      currentLocation,
      currentCompany,
      highestQualification,
      linkedinProfile,
      expectedCTC,
      currentCTC,
      noticePeriod,
      totalExperience,
      skills,
      customQuestions,
      resume,
      comments,
      referralId,
    });

    // Save the new applicant object to the database
    const savedApplicant = await newApplicant.save();

    res.status(201).json({
      message: 'Applicant created successfully',
      applicant: savedApplicant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong while creating the applicant',
    });
  }
};

const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Applicant.findById(id);

    if (!applicant) {
      return res.status(404).json({
        message: 'Applicant not found',
      });
    }

    res.status(200).json({
      message: 'Applicant details fetched successfully',
      applicant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Something went wrong while fetching the applicant details',
    });
  }
};

module.exports = {
  createApplicant,
  getApplicantById,
};
