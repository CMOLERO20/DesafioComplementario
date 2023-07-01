const {Router} = require('express');
const routerMocking = Router();

const {generate100Products} = require('../controllers/productController')

routerMocking.get('/mockingproducts', generate100Products)

module.exports = routerMocking; 