const jwt = require('jsonwebtoken');
const config = require('config');
//This middleware gets an authentication token and verifies the token. Ultimately the middleware passes the data to our authentication route.

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

<<<<<<< HEAD
  //Check if no token
  if (!token) {
    return res.status(401).json, { msg: 'No token, authorization denied' };
  }
=======
    //Check if no token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
>>>>>>> 18336a8d6a750ce1a5a460df1203ad61d29eae93

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

<<<<<<< HEAD
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
=======
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({msg: 'Token is not valid' });
    }
>>>>>>> 18336a8d6a750ce1a5a460df1203ad61d29eae93
};

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ0NjM1NjlhOWNmZTI0Mzc0ZTAzNGY1In0sImlhdCI6MTU2NDg4MjI4MSwiZXhwIjoxNTY1MjQyMjgxfQ.MHUO21OTMWr0EzWxSiE0Fo-1wNhMbOA9VUQyf2tdUxY
