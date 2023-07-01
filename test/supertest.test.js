const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing Api Ecommerce', ()=>{

    describe('Test de Session',()=>{
        const monckUser = {
            
                
                "first_name": "user mock",
                "last_name": "test",
                "email": "pruebauserTest@gmail.com",
                "password": "654321",
                "role": "USER",
                "cart": [],
                            
        }
        // it('El endpoint Post /api/session/register debe registrar a un usuario', (done)=>{
        //     requester.post('/api/session/register').send(monckUser)
        //     .set('Accept', 'application/json')
        //    .expect(200)
        //    .then(res=>{         
        //     done()
        //    })
           
                    	           	
        // })    
        it('El endpoint Post /api/session/login debe logear a un usuario', (done)=>{
            let userData = {username : monckUser.email,password:monckUser.password};
            
            requester.post('/api/session/login').send(userData)
           .expect(200)
           .then(res=>{        
            console.log('res',res) 
            done()
           })
           
                    	           	
        })    
    })
    describe('Test de productos',()=>{
        const productMock = {
            title: "producto Mock",
            description: "lalala",
            price: 300,
            thumbnail: "imagen1",
            code: 144,
            stock: 9,
            category: "aaa",
            owner: "admin"
        }
       
        it('El endpoint Post /api/products debe crear un producto', (done)=>{
            requester.post('/api/products/').send(productMock)
            .set('Accept', 'application/json')
           .expect(200)
           .then(res=>{
            productMock._id = res.body.product._id           
            done()
           })
           
                    	           	
        })    
        it('El endpoint Get /api/products debe traer todos los productos', (done)=>{
            requester.get('/api/products/')
           .expect(200, done)
                      	           	
        })
        it('El endpoint Get /api/products/:pid debe traer un producto segun el id', (done)=>{
            requester.get('/api/products/6413d018e007ede4844f1805')
           .expect(200, done) 	           	
                      	           	
        })    
        // it('El endpoint Put /api/products/:pid debe actualizar un producto un producto segun el id', (done)=>{
        //     requester.put('/api/products/6413d018e007ede4844f1805').query({prop:"stock",content:40})
        //    .expect(200, done) 	           	
                      	           	
        // })

        })
        
    })
