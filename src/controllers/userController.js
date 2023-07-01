const UserDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const {SECRET_JWT_EMAIL} = require('../utils/jwt')
const {createHash , isValidPass} = require('../utils/bcrypt');
const transporter= require('../config/mailer.config.js')

const userService = new UserDao();

const  getUsers = async (req,res) => {
    try {
        const data = await userService.getAllUser();
        if (!data) {
            req.logger.error('error al traer los usuarios');
            return res.status(500).json({
              message: `something was wrong in getUsers`,
            });
          }
          return res.json({
            message: `getProducts`,
            users: data,
          });
    } catch (error) { 
      console.log("🚀 ~ file: userController.js:19 ~ getUsers ~ error:", error)
      
        
    }
 };

const  getUserById = async (req,res) => {
try {
    const {pid} = req.params;
    const data = await userService.getUserById(pid);
    if (!data) {
       throw error
      }
      return res.json({
        message: `getUserById`,
        user: data,
      });
} catch (error) { 
  req.logger.error(`Error al buscar el usuario` )
  return res.status(500).json({
    message: `something was wrong in getUserById`,
  });
}
 }

const cambiarRol = async(req,res)=>{
    try {
     let uid = req.params.uid;
     let user = await userService.getUserById(uid);
     if(!user.documents.id || !user.documents.adress || !user.documents.bank){
      return res.status(400).json({
        message: `Falta subir Identificación, Comprobante de domicilio o Comprobante de estado de cuenta
        `
      });

     }
     if(user.role=='USER'){ 
       await userService.updateUser(uid,"role",'PREMIUM')
       return res.json({
        message: `cambiarRol`,
        User: `${user._id}`,
        newRole: 'Premium'
      });
     }
     if(user.role=='PREMIUM'){ 
        await userService.updateUser(uid,"role",'USER')
        return res.json({
            message: `cambiarRol`,
            User: `${user._id}`,
            newRole: 'User'
          });
     }
     

    } catch (error) {
        console.log("🚀 ~ file: userController.js:9 ~ cambiarRol ~ error:", error)
        
    }


}

const forgotPass = async(req,res)=>{
  const {email} = req.body;
  if(!(email)){
    return res.status(400).json({message:'user email require require'})
  }
  
  let verificationLink;
  let user;
  const usersData = await userService.getAllUser();

  try {
    user = await userService.getUserByEmail(email);
  
    const token = jwt.sign({userId: user[0]._id, email: user[0].email}, SECRET_JWT_EMAIL,{expiresIn: '5m'});
  
    verificationLink = `http://localhost:8080/new-pass/${token}`;
  
    await userService.updateUser(user[0]._id,"resetToken",token)

     await transporter.sendMail({
      from: '"Reset Password 👻" <molero.clara@gmail.com>', 
      to: user[0].email, 
      subject: "Reset password", 
      html: `
      <b>Plesae click on the following link, os paste this into your browser </b>
      <a href="${verificationLink}">${verificationLink}</a>
      `, 
    });


   res.send({message: 'Check your email',link: verificationLink});
  } catch (error) {
    console.log("🚀 ~ file: userController.js:94 ~ forgotPass ~ error:", error)
    
  }

  }

const createNewPass = async(req,res)=>{
  const {newPass} = req.body;
  const token = req.headers.token

  if(!(token && newPass)){
    res.status(400).json({message:'all fields require'})
  }
   const dataUsers = await userService.getAllUser();
   let  jwtPayload
   let  user
 try {
  jwtPayload = jwt.verify(token, SECRET_JWT_EMAIL);
 } catch (error) {
  console.log("🚀 ~ file: userController.js:117 ~ createNewPass ~ error:", error)
  return res.status(400).json({message:'Token Expire, comience de nuevo'}).render("forgot-pass");
  
 }
     
    
    try{
     user = await userService.getUserById(jwtPayload.userId);
    if(isValidPass(user, newPass)){
     return res.status(400).json({message:'el nuevo pass no puede ser igual al viejo'})
    };
      await userService.updateUser(jwtPayload.userId,"password",createHash(newPass) )
      res.send({message: 'password update', user: user._id});
    } catch (error) {
      return res.status(400).json({message:'Something wnte wrong with saving new pass'})
      
    }
 



}


module.exports = {cambiarRol, getUserById,getUsers, forgotPass,createNewPass}