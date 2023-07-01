const { body,param} = require('express-validator');

const {mappingValidationMdw} = require('../middleware/mapping.validator.middleware.js');

const validateCreateProduct = [
    body('**.title').notEmpty().withMessage('Product title is required'),
    body('**.description').notEmpty().withMessage('Product description is required'),
    body('**.price').notEmpty().withMessage('Product price is required').isInt().withMessage("price must be a number")
    .custom((value) => value > 0)
    .withMessage("price year must be a positive number"),
    body('**.code').notEmpty().withMessage('Product code is required').isInt().withMessage('Product code must be a number'),
    body('**.stock').notEmpty().withMessage('Product stock is required').isInt().withMessage("Stock must be a number"),

    mappingValidationMdw,
];

const validateProductId = [
    param("pid")
    .notEmpty()
    .withMessage("pid parameter is required")
    .isMongoId()
    .withMessage("Invalid pib format"),
  mappingValidationMdw,
];

const validateUpdateProduct = [
    body('**.prop').notEmpty().withMessage('Product property is required'),
    body('**.content').notEmpty().withMessage('Product property content is required'),
    
    mappingValidationMdw,
];

module.exports = {validateCreateProduct,validateProductId,validateUpdateProduct};

