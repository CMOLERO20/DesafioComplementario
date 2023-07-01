const CartDao = require("../dao/cartDao");
const ProductDao = require("../dao/productDao");
const TicketDao = require("../dao/ticketDao")

const { error } = require("winston");

const productService = new ProductDao()
const cartService = new CartDao();
const ticketService = new TicketDao();

const getCarts = async(req,res) =>{
    try {
        const data = await cartService.getCarts();
        if(!data){
            req.logger.error('error al traer los carritos');
            return res.status(500).json({
                message: 'something was wrong in GetCarts'
            })
        }
        return res.json({
            message: 'GetCarts',
            carts: data
        })
    } catch (error) {
        console.log("🚀 ~ file: cartManager.js:9 ~ getCarts ~ error:", error)
        
    }
}

const getCartsById = async(req,res) =>{
    try {
        const {cid} = req.params
        const data = await cartService.getCartById(cid);
        if(!data){
            return res.status(500).json({
                message: 'Carrito no existente'
            })
        }
        return res.json({
            message: 'GetCartById',
            cart: data
        })
    } catch (error) {
        console.log("🚀 ~ file: cartManager.js:37 ~ getCartsById ~ error:", error)
        
        
    }

}

const createCart = async(req,res) =>{
    try {
        const uid = req.session.user.id;
        let newCart = {user:uid}
        const data = await cartService.createCart(newCart);
        if(!data){
            return res.status(500).json({
                message: 'something was wrong in createCart'
            })
        }
        return res.json({
            message: 'createCart',
            carts: data
        })
    } catch (error) {
        console.log("🚀 ~ file: cartManager.js:57 ~ createCart ~ error:", error)
        
        
    }
}

const addProduct = async(req,res) =>{
    try {
        const {cid,pid} = req.params
        const userId = req.session.user.id
        let cart = await cartService.getCartById(cid);
        if(cart.user !== userId){return res.status(400).json({
            message: 'not user from cart'
        })}
        let product = await productService.getProductById(pid);
        if(product.owner == userId){return res.status(400).json({
            message: 'cannot add a product from your ownership'
        })}

        const data = await cartService.addProduct(cid,pid);
        if(!data){
            return res.status(500).json({
                message: 'something was wrong in AddProduct'
            })
        }
        return res.json({
            status: "sucess",
            message: data
        })
    } catch (error) {
        console.log("🚀 ~ file: cartManager.js:77 ~ addProduct ~ error:", error)
         
    }

}

const deleteProducts = async(req,res) =>{
    try {
        const {cid,pid} = req.params
        let cart = await cartService.getCartById(cid);      
        const result = cart.products.find(prod => prod.product == pid)
        if(!result){
            return 'el producto no existe'
            } else if(result.quantity > 1) {result.quantity -= 1} 
            else {
                let indexId = cart.products.findIndex(product => product.id == pid)
                cart.products.splice(indexId,1)
            }
        const resultado = await cartService.updateCart(cid,cart)
        if(!resultado){ return res.status(500).json({
                message: 'something was wrong in deleteProduct'
            }) }

             return res.json({
                status:"succes",
            message: "producto eliminado"})
           
    } catch (error) {
       console.log("🚀 ~ file: cartManager.js:97 ~ deleteProducts ~ error:", error)
       
         
    }

}

const purchase = async(req,res)=>{
    try {
        const {cid} = req.params;
        const cartData = await cartService.getCartById(cid);
      
        if(!cartData){return res.status(500).json({
            message: 'something was wrong in GetCartsByid'
        })}
      
        let prodEnStock = []
        let prodSinStock = []
        let cont=0
        let amount = 0;
       while(cartData.products.length > cont){
            let prodId = cartData.products[cont].product
            let prod = await productService.getProductById(prodId)
            if(!prod){return res.status(500).json({
                message: `producto ${prodId} no encontrado`
            })}
            if(cartData.products[cont].quantity<prod.stock){ 
                prodEnStock.push(cartData.products[cont])
                prod.stock -= (cartData.products[cont].quantity)
                await productService.updateProduct(prodId,prod)
                amount += prod.price*cartData.products[cont].quantity
                cartData.products.splice(cont,1)

            }        
            else {
                prodSinStock.push(cartData.products[cont]);
                cont += 1
            }

        }
        await cartService.updateCart(cid,cartData);
        
        if(amount==0){return res.send({message: `Productos sin stock`})}

        let code = Date.now() + Math.floor(Math.random() * 10000 + 1);
        const ticket = {
            code:code,
            purchase_datetime: Date.now(),
            amount: amount,
            purchaser: cartData.user,
            items: prodEnStock
        }
         let newTicket = await ticketService.createTicket(ticket)
  
    return res.send({
            status: 'Sucess',
            cart: cartData,
            Ticket: newTicket,
            productosSinStock: prodSinStock
        })
    } catch (error) {
        console.log("🚀 ~ file: cartController.js:170 ~ purchase ~ error:", error)
        
        
    }
}



module.exports = {getCarts,getCartsById,createCart,purchase,addProduct,deleteProducts};