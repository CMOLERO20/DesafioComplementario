const userModel = require("../model/user.model")

class UserDao {
    getAllUser = async () => {
        try {
            const data = await userModel.find({}).lean();
            return data
        } catch (error) { 
            console.log("🚀 ~ file: productDao.js:11 ~ ProductDao ~ getAllProducts= ~ error:", error)
            
        }
     };

     getUserById = async (id) => {
        try {
            const data = await userModel.findById({_id: id})
            if(!data) return 'user no encontrado'
            return data
        } catch (error) {
           
            
        }
     }


     addUser = async (newUser) => {
        try {
             
        return await userModel.create(newUser);
        } catch (error) {
            
            
            return error
        }
     }
     async updateUser(uid,prop,content){

        try {
            const user = await this.getUserById(uid);
            if(!user)return 'User no encontrado'
            user[prop] = content;
            const result = await userModel.updateOne({_id:uid},user);
            return result
        } catch (error) {
            console.log("🚀 ~ file: userDao.js:44 ~ UserDao ~ updateUser ~ error:", error)
            
            }
     }
        deleteUser = async (pid) => {
            try {
                const result = await userModel.deleteOne({_id: pid})
                return result
            } catch (error) {
                return error                
            }
        }
        getUserByEmail = async(data)=>{
            try {
                return await userModel.find({email:data})
            } catch (error) {
                console.log("🚀 ~ file: userDao.js:60 ~ UserDao ~ getUserBy=async ~ error:", error)
                
            }
        }
}

module.exports = UserDao