const { Router } =  require("express");   
const routerUsers = Router();
const handlePolicies = require("../middleware/handle-policies.middleware");

const {cambiarRol,getUserById,getUsers,forgotPass,createNewPass} = require("../controllers/userController");

routerUsers.get('/', getUsers);
routerUsers.get('/:pid', getUserById);
routerUsers.put('/premium/:uid', cambiarRol);
routerUsers.post('/forgot-pass', forgotPass);
routerUsers.post('/new-pass/',createNewPass);


module.exports = routerUsers;