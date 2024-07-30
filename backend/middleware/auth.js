const jwt = require('jsonwebtoken');
const respondWithStatus = require('../utils/statusCode');
const serverConfig = require('../config/server-config');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return respondWithStatus(res, 401, 'No token provided');
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            return respondWithStatus(res, 400, 'Invalid token format');
        }
        const tokenEmail = decoded.email;
        console.log(tokenEmail);
        jwt.verify(token, serverConfig.JWT_SECRET, { algorithms: ['HS256'] }, (err, verifiedDecoded) => {
            if (err) {
                console.error('Token verification error:', err.message);
                return respondWithStatus(res, 403, 'Failed to authenticate token');
            }

            req.decoded = verifiedDecoded; 
            req.decodedEmail = decoded.email;
            next(); 
        });

    } catch (error) {
        console.error('Error decoding token:', error.message);
        return respondWithStatus(res, 400, 'Invalid token');
    }
};


// exports.isAuthenticated = (async (req, res, next) => {
   
//     const token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
  
//     if (!token) {
//         return res.status(401).json({ message: "Not Authenticated" });
//     }

//     try {
//         const decodedToken = jwt.verify(token, secret, { algorithms: ['HS256'] });
    
//         const user = await User.findById(decodedToken._id);
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Authentication Error:", error.message, error.stack);
//         return res.status(401).json({ message: "Authentication failed" });
//     }
// });

module.exports = verifyToken;
