const jwt = require('jsonwebtoken');
const { ACCESS_SECRET } = require('../utils/authUtils');

function authMiddleware(req, res, next){
    const header = req.headers.authorization || "";
    
    const [scheme, token] = header.split(" ");

    if(scheme !== "Bearer" || !token){
        return res.status(401).json({error: "Missing or invalid autharization header."});
    }
    try { 
        const payload = jwt.verify(token, ACCESS_SECRET);
        req.user = payload;
        next();
    } catch(e) {
        return res.status(401).json({
            error: "Invalid or expired token",
            details: e.message
        });
    }
}

module.exports = authMiddleware;