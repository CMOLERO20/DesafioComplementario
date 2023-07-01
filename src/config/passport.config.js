const passport = require('passport');
const local = require('passport-local');
const userModel = require('../model/user.model');
const {createHash , isValidPass} = require('../utils/bcrypt');
const GitHubStrategy = require('passport-github2');
const LocalStrategy = local.Strategy;

const {generateJWT,SECRET_JWT} = require("../utils/jwt")
const jwt = require('passport-jwt');
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const ROLES = require("../constantes/role");

const cookieExtractor = req =>{
    let token = null;
    if (req && req.cookies){
        token = req.cookies['cookieToken']
    }
    return token
}


const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done)=>{
            try {
                
                const {first_name,last_name,email,role} = req.body;
                let user = await userModel.findOne({email:username});
                if(user){
                    
                    console.log('user already exist');
                    return done(null,false);
                }
                const newUser = {first_name,last_name,email,role, password:createHash(password)}
                let result = await userModel.create(newUser);
                return done(null,result);

            } catch (error) {
                console.log("🚀 ~ file: passport.config.js:15 ~ {passReqToCallback:true,usernameField:'email'}, ~ error:", error)
                
            }
        }
    ))

    passport.serializeUser((user,done)=>{
        done(null, user._id);
    });
    passport.deserializeUser(async(id,done)=>{
        let user = await userModel.findById(id);
        done(null,user)
    })
    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done)=>{
        try {
            const user = await userModel.findOne({email:username})
            if(!user){
                console.log("User doesnt exist")
                return done (null,false);
            }
            if(!isValidPass(user, password)) return done(null,false);
            user.last_connection = new Date()
            await userModel.updateOne({_id:user._id},user)
            return done(null,user)
        } catch (error) {
            console.log("🚀 ~ file: passport.config.js:39 ~ passport.use ~ error:", error)
            
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID:"Iv1.7c5c9c095a18deb9",
        clientSecret:'fb659b881773b333af4338b168220a14944e95bd',
        callbackURL:'http://localhost:8080/api/session/githubcallback'
    },async (accessToken, refreshToken,profile,done)=>{
        try {
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email})
            if(!user){
                console.log('nuevo usuario')
                let newUser = {
                    first_name:profile._json.login,
                    last_name:"",
                    email:profile._json.email,
                    password:""
                }
                let user = await userModel.create(newUser);
                done(null,user);
            }
            else{
                console.log("usuario ya existente")
                done(null,user);
            }
        } catch (error) {
            console.log("🚀 ~ file: passport.config.js:58 ~ initializePassport ~ error:", error)
            
        }
    }
    ))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:SECRET_JWT,
    },async (jwtPayload, done) => {
                
        try {
          if (ROLES.includes(jwtPayload.role)) {
            return done(null, jwtPayload);
          }
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    ))

}

module.exports = initializePassport;