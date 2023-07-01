const mongoose = require('mongoose');
const Cart = require('../src/dao/cartDao')
const chai = require('chai');
const {configConnection} = require('../src/config/mongo.config');
const { getProductById } = require('../src/controllers/productController');

const expect = chai.expect;



describe('Testing Cart Dao', ()=>{
    const prodMock = {
        "_id": "6413d018e007ede4844f1805",
            "title": "producto1",
            "description": "lalala",
            "price": 3,
            "thumbnail": "imagen1",
            "code": 146,
            "stock": 10,
            "category": "aaa",
            
    }
    const fakeUid = {user:"646eb650d15fd6781f702591"}
    const cartTest = {
        "_id": "64861c17d302ea140cb0fb66",
        "user": "646eb650d15fd6781f702591",
        "products": [],
        "__v": 0
    }
    const cartId = '64861db0de28c6050a0b4dc3'
    const cartDao = new Cart()
    before(async()=>{
        await mongoose.connect(configConnection.url,configConnection.options);
    })

    after(async()=>{
        await mongoose.connection.close()
    })
   
    beforeEach(function(){
       
    })
    it('El Dao debe poder obtener los carritos en forma de Array', (done)=>{
       
        const result =  cartDao.getCarts().then((res)=>{
            expect(Array.isArray(res)).to.be.ok;
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe crear un carrito nuevo', (done)=>{
       
        const result =  cartDao.createCart(fakeUid).then((res) => {
                  
            expect(200);
            	
          	done()
        	}).catch((error)=>{
            	done(error)
        	})
        })
       
    
    it('El Dao debe poder obtener un carrito por su id', (done)=>{
       
        const result =  cartDao.getCartById(cartId).then((res)=>{
            expect(200);
            
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe poder agregar un producto a un carrito ', (done)=>{
        
         const result =  cartDao.addProduct(cartId,prodMock._id).then((res)=>{
             expect(200);
             done()
         }).catch((error)=>{
             done(error)
         })
        
     })
    it('El Dao debe actualizar un carrito segun su id', (done)=>{

        let cartUpdated= cartTest
        cartUpdated.products = []
        const result =  cartDao.updateCart(cartUpdated._id,cartUpdated).then((res)=>{
            expect(200);
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe borrar un producto de un carrito', (done)=>{

        const result =  cartDao.deleteProduct(cartId,prodMock._id).then((res)=>{
            expect(200);
            done()
        }).catch((error)=>{
            done(error)
        })
       
     })

    })