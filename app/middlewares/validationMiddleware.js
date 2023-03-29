const { body, validationResult } = require('express-validator');

const registrationValidationRules = () => {
  return [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name should have at least 2 characters')
      .isAlpha('en-US', { ignore: ' -' })
      .withMessage('Name should only contain alphabets and spaces'),
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password should have at least 6 characters'),
    body('confirmPassword')
      .notEmpty()
      .withMessage('Confirm Password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm Password should match with Password');
        }
        return true;
      }),
  ];
};

const registrationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = { registrationValidationRules, registrationMiddleware };
