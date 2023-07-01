const mongoose = require('mongoose');
const Product = require('../src/dao/productDao')
const chai = require('chai');
const {configConnection} = require('../src/config/mongo.config');
const { getProductById } = require('../src/controllers/productController');

const expect = chai.expect;



describe('Testing Products Dao', ()=>{
    const prodMock = {
        title: "producto Mock",
        description: "lalala",
        price: 300,
        thumbnail: "imagen1",
        code: 144,
        stock: 9,
        category: "aaa",
        owner: "admin"
    }
    const productsDao = new Product()
    before(async()=>{
        await mongoose.connect(configConnection.url,configConnection.options);
    })

    after(async()=>{
        await mongoose.connection.close()
    })
   
    beforeEach(function(){
       
    })
    it('El Dao debe poder obtener los productos en forma de Array', (done)=>{
       
        const result =  productsDao.getAllProducts().then((res)=>{
            expect(Array.isArray(res)).to.be.ok;
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe crear un producto nuevo', (done)=>{
       
        const result =  productsDao.addProduct(prodMock).then((res)=>{
            expect(res.title).to.equal(prodMock.title);
            prodMock._id = res._id;
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe poder obtener un producto por su id', (done)=>{
       
        const result =  productsDao.getProductById(prodMock._id).then((res)=>{
            expect(200);
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe actualizar un producto segun su id', (done)=>{

        let prodUpdated= prodMock
        prodUpdated.title = "title updated"
        const result =  productsDao.updateProduct(prodMock._id,prodUpdated).then((res)=>{
            expect(200);
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })
    it('El Dao debe borrar un producto segun su id', (done)=>{

        const result =  productsDao.deleteProduct(prodMock._id).then((res)=>{
            expect(200);
            done()
        }).catch((error)=>{
            done(error)
        })
       
    })

})