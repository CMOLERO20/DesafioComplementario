const { Router } = require("express");

const productModel = require('../model/products.model')
const handlePolicies = require("../middleware/handle-policies.middleware")
const {validateUserRegistration, validateUserLogin} = require('../validations/user.validation.middleware.js')
const passport = require("passport");
const {logOut, login} = require('../controllers/sessionController')

const router = Router();

router.get("/logout", logOut);

router.post("/login",validateUserLogin, passport.authenticate('login',{failureRedirect:'/api/session/fail_login'}), login);

router.get("/current", handlePolicies(["PUBLIC"]), async (req, res) => {
    console.log(" VALIDANDO REQ", req.user);
    return res.json({ message: `jwt en las cookies public` });
  }
);
router.get("/current/user", handlePolicies(["USER"]), async (req, res) => {
  console.log(" VALIDANDO REQ", req.user);
  return res.json({ message: `jwt en las cookies user` });
}
);
router.get("/current/admin", handlePolicies(["ADMIN"]), async (req, res) => {
  console.log(" VALIDANDO REQ", req.user);
  return res.json({ message: `jwt en las cookies admin` });
}
);
router.get('/fail_login', (req,res)=>{ res.send({error:"Failed login"})
  });
  
router.post('/register',validateUserRegistration, passport.authenticate('register',{failureRedirect:'/fail_register'}), async(req,res)=>{
res.render('login');
})

router.get('/fail_register',async(req,res)=>{
  console.log("Failed Strategy");
  res.send({error:"Failed"})
})

router.get('/github',passport.authenticate('github',{scope:['user,email']}), async(req,res)=>{

})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}),async(req,res)=>{
  req.session.user = req.user;
  console.log('login succesfull');
 
  const products = await productModel.find({}).lean();
  
  return res.render("products", { productos: products,
    first_name: req.session.user.first_name,
   
    
    rol: "usuario", 
    
  });


})


module.exports = router;