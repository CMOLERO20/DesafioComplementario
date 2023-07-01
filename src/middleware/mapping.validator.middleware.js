const {validationResult} = require('express-validator')

const mappingValidationMdw = (req,res,next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const validationErrors = errors.array().map((error) => {
        return {
          field: error.param,
          message: error.msg,
        };
      });
      return res.status(400).json({ errors: validationErrors });
  
    }
  
    next();
}

module.exports = {mappingValidationMdw};