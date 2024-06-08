const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // console.log(authHeader,'authHeader++++')
  const token = authHeader && authHeader.split(' ')[1];
  // console.log(token,'token++++')
  if (!token) {
    return res.status(401).json({ isSuccess: false, message: 'Access token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);  // Log the error details
      return res.status(403).json({ isSuccess: false, message: 'Invalid access token' });
    }
    
    console.log('Token verification successful:', user); 
    req.user = user; // Store the user information in the request object
    next();
  });
};

module.exports = verifyToken;
