const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader,'authHeader+++++++')
  const token = authHeader && authHeader.split('Bearer')[1];
//   console.log(token,'token+++++++++middleware')

  if (!token) {
    return res.status(401).json({ isSuccess: false,error: "Unauthorized", message: 'Access token is missing' });
  }

try{  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ isSuccess: false, message: 'Invalid access token' });
    }

    req.user = user; // Store the user information in the request object
    next();
  })}
  catch(error){
    return res.sendStatus(401);
  }
};

module.exports = verifyToken;
