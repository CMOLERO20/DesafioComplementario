
const ProductDao = require("../dao/productDao");

const productService = new ProductDao();

const {generate100Product} = require("../utils/faker");


const CustomError = require("../utils/errors/customerrors");
const EErrors = require("../utils/errors/enums");
const generateProductErrorInfo = require("../utils/errors/info");
const { error } = require("winston");

const  getProducts = async (req,res) => {
        try {
            const productArr = await productService.getAllProducts();
            if (!productArr) {
                req.logger.error('error al traer los productos');
                return res.status(500).json({
                  message: `something was wrong in getProducts`,
                });
              }
              return res.json({
                message: `getProducts`,
                products: productArr,
              });
        } catch (error) { 
            console.log("🚀 ~ file: productManager.js:21 ~ getProducts ~ error:", error)
            
        }
     };

const     getProductById = async (req,res) => {
    try {
        const {pid} = req.params;
        if(!pid){return res.status(401).json({
          message: `No hay pid`,
        });}
        const data = await productService.getProductById(pid);
        if (!data) {
           throw error
          }
          return res.json({
            message: `getProductsById`,
            product: data,
          });
    } catch (error) { 
      req.logger.error(`Error al buscar el producto` )
      return res.status(500).json({
        message: `something was wrong in getProductById`,
      });
    }
     }

const  addProduct = async (req,res) => {
    try {
      const file = req.file;
  console.log("🚀 ~ file: pets.routes.js:15 ~ router.post ~ file", file);
  if (!file) return res.status(400).send({ message: "Couldn't upload file" });
        const product = req.body;        
      if(!product.owner) {product.owner = req.session.user.id}
      product.thumbnail = `http://localhost:8080/public/uploads/${file.filename}`
        const data = await productService.addProduct(product) ;
        
        if (data.errors) {
          req.logger.error("Error al crear producto")
            return res.status(500).json({
              message: `something was wrong in addProduct`,
              error: data.errors
            });
          }
          return res.json({
            status: "success",
            product: data,
          });
    } catch (error) { 
        console.log("🚀 ~ file: productManager.js:59 ~ addProduct ~ error:", error)
        
    }
     }

const  updateProduct = async (req,res) => {
        try {
          const {pid} = req.params;
          const {prop,content} = req.body
          const user = req.session.user
          let product = await productService.getProductById(pid);
          if(product.owner !== user.id && user.role !== 'ADMIN'){return res.status(400).json({
              message: 'not allow to do changes'
          })}
            product[prop] = content;
            const data = await productService.updateProduct(pid,product) ;
            if (!data) {
              req.logger.error("Error al actualizar el producto")
                return res.status(500).json({
                  message: `something was wrong in updateProduct`,
                });
              }
              return res.json({
                status: `sucess`,
                product: `${product._id} updated `
              });
        } catch (error) { 
            console.log("🚀 ~ file: productManager.js:77 ~ updateProduct ~ error:", error)
            
        }
         }

const    deleteProduct = async (req,res) => {
    try {
        const {pid} = req.params;
        const user = req.session.user
          let product = await productService.getProductById(pid);
          if (!product) {
            req.logger.error("Error al eliminar el producto")
              return res.status(400).json({
                message: `no existe el producto`,
              });
            }
          if(product.owner !== user.id && user.role !== 'ADMIN'){return res.status(500).json({
              message: 'not allow to do changes'
          })}
        const data = await productService.deleteProduct(pid) ;
        
        if (!data) {
            req.logger.error("Error al borrar el producto")
            return res.status(500).json({
              message: `something was wrong in deleteProduct`,
              error: data.errors
            });
          }
          return res.json({
            message: `deleteProduct`,
            product: "delete ok",
          });
    } catch (error) { 
        
        
        
    }

        }

const generate100Products = async(req,res)=>{
      try {
        const data =  generate100Product();
        console.log("🚀 ~ file: productController.js:106 ~ generate100Products ~ data:", data)
        if(!data){
          return res.status(500).json({
            message: `something was wrong in generate100Products`,
          });
        }
        return res.json({
          message: 'generate100Products',
          answer: data
        })
      } catch (error) {
        console.log("🚀 ~ file: productController.js:116 ~ generate100Product ~ error:", error)
        
      }

  }
      



module.exports =  {getProducts,getProductById,addProduct,deleteProduct,updateProduct,generate100Products};