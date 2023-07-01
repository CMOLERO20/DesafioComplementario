const { Router } =  require("express");   
const {purchase,getCarts,getCartsById,createCart,addProduct,deleteProducts} = require('../controllers/cartController')
const handlePolicies = require("../middleware/handle-policies.middleware")
const {validateCartId} = require('../validations/cart.validation.middleware')
const {validateProductId} = require('../validations/product.validate.middleware')

const routerCarts = Router();



routerCarts.get('/', getCarts);
routerCarts.post('/', createCart);
routerCarts.get('/:cid',validateCartId, getCartsById);
routerCarts.put('/:cid/product/:pid',validateCartId,validateProductId, handlePolicies(["USER","PREMIUM","ADMIN"]), addProduct);
routerCarts.delete('/:cid/product/:pid', validateCartId,validateProductId,deleteProducts);
routerCarts.get('/:cid/purchase', validateCartId,purchase);


module.exports = routerCarts;