const { Router } =  require("express");   
const routerProducts = Router();
const handlePolicies = require("../middleware/handle-policies.middleware")

const {getProducts,getProductById,addProduct,deleteProduct,updateProduct} = require("../controllers/productController")

const {validateCreateProduct, validateProductId, validateUpdateProduct} = require('../validations/product.validate.middleware.js');

const {uploader} = require('../utils/multer.js')
routerProducts.get('/', getProducts)

routerProducts.get('/:pid', getProductById );

routerProducts.post('/',uploader.single('file'), validateCreateProduct, addProduct)

routerProducts.put('/:pid',validateProductId,validateUpdateProduct,handlePolicies(['ADMIN','PREMIUM']), updateProduct)

routerProducts.delete('/:pid',validateProductId,handlePolicies(['ADMIN','PREMIUM']),deleteProduct)


module.exports = routerProducts;