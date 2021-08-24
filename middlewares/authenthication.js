const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
  const token = req.get('Authorization');
  jwt.verify(token, process.env.SECRET, (err, decoded) =>{

    if(err) res.status(401).send({err})

    req.user = decoded.user;

    next();
  })
};

module.exports = {
  verifyToken
}
