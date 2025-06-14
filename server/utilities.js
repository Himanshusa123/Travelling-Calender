const jwt = require('jsonwebtoken');

function authenticatetoken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Use space as the delimiter

    // No token, unauthorized
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Token invalid, forbidden
        if (err) {
            return res.sendStatus(403); // Use 403 for forbidden
        }
        req.user = user; // Attach user to request object
        next(); // Call next middleware
    });
}

module.exports = { authenticatetoken };