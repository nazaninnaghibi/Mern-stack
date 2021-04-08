const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

  console.log(req.headers);
  //get the token from header
  const token = req.headers.authorization.split(" ")[1];
  //check if token is there
  if (!token) {
    return res.status(400).json({ msg: 'the token authorization is denied' });
  }
  // Verify token
  try {
   
      const decoded = jwt.verify(token, config.get('jwtsecret'));

      // req.user = decoded.user;
      req.userId = decoded?.id;
      
      next();
     
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};