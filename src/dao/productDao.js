
const productModel = require("../model/products.model");

class ProductDao {

     getAllProducts = async () => {
        try {
            const productArr = await productModel.find({}).lean();
            return productArr
        } catch (error) { 
            console.log("🚀 ~ file: productDao.js:11 ~ ProductDao ~ getAllProducts= ~ error:", error)
            
        }
     };

     getProductById = async (pid) => {
        try {
            const productById = await productModel.findById({_id: pid})
            if(!productById) return 'producto no encontrado'
            return productById
        } catch (error) {
           
            
        }
     }

     addProduct = async (newProduct) => {
        try {
             
        return await productModel.create(newProduct);
        } catch (error) {
            
            return error
        }
     }
     async updateProduct(id,producto){

        try {
          
            return await productModel.updateOne({_id:id},producto);
            
        } catch (error) {
            console.log("🚀 ~ file: productDao.js:54 ~ ProductDao ~ updateProduct ~ error:", error)
            
    }
     }
     deleteProduct = async (pid) => {
            try {
                const result = await productModel.deleteOne({_id: pid})
                return result
            } catch (error) {
                return error                
            }
        }
      }



module.exports =  ProductDao;