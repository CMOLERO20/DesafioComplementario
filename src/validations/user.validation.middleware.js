const { body,param} = require('express-validator');

const {mappingValidationMdw} = require('../middleware/mapping.validator.middleware.js');


const validateUserRegistration = [
    param('password').notEmpty().withMessage('Password is required'),
    body('**.first_name').notEmpty().withMessage('First Name is required'),
    body('**.last_name').notEmpty().withMessage('Last name is required'),
    body('**.email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not email format'),
    mappingValidationMdw,
];

const validateUserLogin = [
    body('**.email').notEmpty().withMessage('Email is required').isEmail().withMessage('Not email format'),
    body('**.password').notEmpty().withMessage('Password is required'),
    mappingValidationMdw,
];

module.exports = {validateUserRegistration,validateUserLogin}