const {Router} = require("express");
const routerLogger = Router();

routerLogger.get('/', (req,res)=>{
        req.logger.http('logger Test http');
        req.logger.error("logger Test error");
        req.logger.info('logger Test info')
        return res.json({
            url: 'loggerTest',
            message: 'se crearon logs de prueba en consola y en archivo'

        })
})

module.exports = routerLogger