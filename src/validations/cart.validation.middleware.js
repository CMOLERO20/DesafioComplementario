const { body,param} = require('express-validator');

const {mappingValidationMdw} = require('../middleware/mapping.validator.middleware.js');


const validateCartId = [
    param("cid")
    .notEmpty()
    .withMessage("cart id parameter is required")
    .isMongoId()
    .withMessage("Invalid cib format"),
  mappingValidationMdw,
];

module.exports = {validateCartId}