const winston = require("winston");
const EErrors = require("./errors/enums");

const customLevelsOptions = {
    levels: {
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    }
}

const devLogger =  winston.createLogger({
    level:"http",
    transports:[
        new winston.transports.Console(),
        
    ]
})

const prodLogger =  winston.createLogger ({
    level: "info",
    transports : [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename:"errors.log",format: winston.format.simple()})
]
  });

 const loggersLevels = {
    production: prodLogger,
    development: devLogger
 } 
const setLogger = (req,res,next)=>{
    req.logger = loggersLevels[`${process.env.NODE_ENV}`];
    next();
}
const infoLogger = (req,res,next)=>{
  
    next();
}

module.exports = {setLogger, infoLogger}