const jwt = require('jsonwebtoken');
require("dotenv").config()
const JWT_SECRET = process.env.TOKEN_SECRET_KEY;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Get the token from the "Bearer <token>" format

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and decode the payload
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach user info (from token payload) to the request object
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;