const { find } = require("../model/user.model");
const userModel = require("../model/user.model");
const productModel = require('../model/products.model')
const adminMdw = require("../middleware/admin.middleware");
const {createHash, isValidPass } = require("../utils/bcrypt");
const passport = require("passport");
const {generateJWT }= require("../utils/jwt")

const logOut = async (req, res) => {
    req.session.destroy((err) => {
      if (!err) return res.redirect("/login");
      return res.send({ message: `logout Error`, body: err });
    });
  }

const login =  async (req, res) => {
    try {
      if(!req.user)return res.status(400).send({status:"error",error:"Invalid credentials"})
  
      req.session.user = {
        
        id: req.user._id,
        role: req.user.role,
        email:req.user.email
      };
      
      const token = await generateJWT( req.session.user );
            
      return res
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ message: "login success " });
  
    } catch (error) {
      console.log(
        "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
        error
      );
    }
  }  

const passportCall = (strategy) =>{
    return async(req,res,next) =>{
        passport.authenticate(strategy,function(err, user, info){
            if(err)return next(err);
            if(!user){
                return res.status(401).send({error:info.message?info.messages:info.toString()})
            }
            req.user = user;
            next();
        })(req,res,next)
    }
}  

 module.exports = {logOut, login , passportCall} 