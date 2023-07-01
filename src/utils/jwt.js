const jwt = require("jsonwebtoken");

const SECRET_JWT_EMAIL = 'clave123'
const SECRET_JWT = "CLAVEs3p3rs3cr3t4S1s1";

const generateJWT = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ user }, SECRET_JWT, { expiresIn: "10m" }, (err, token) => {
      if (err) {
        console.log(err);
        reject("can not generate jwt token");
      }
      resolve(token);
    });
  });
};

module.exports = {
  generateJWT,
  SECRET_JWT, SECRET_JWT_EMAIL
};