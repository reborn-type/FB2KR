const {generateAccessToken,
    generateRefreshToken,
    hashPassword,
    verifyPassword,
    authMe} = require("../utils/authUtils");
const authService = require("../services/authService");

async function registerUser(req, res, next) {
    try { 
        const {email, first_name, last_name, password} = req.body; 
        if(!email || !password) return res.status(400).json({error: "missing fields"});
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch(e){
        if (e.message === "USER_EXISTS") return res.status(409).json({ error: "Email exists" });
        next(e);
    };
    
}

async function loginUser(req, res, next) {
    try{ 
        const {email, password} = req.body; 
        const result = await authService.login(email, password);
        res.status(200).json(result);
    } catch(e){
        if (e.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Not authorized" });
        next(e);
    }
};

async function authMeController(){
    try{
        const {email} = req.body; 
        if(!email) return res.status(400).json({error: "required field - email"});
        const result = await authService.authMe(email);
        res.status(200).json(result);
    } catch (e){
        return res.status(404).json("User not found");
        next(e);
    }
}

async function updateRefreshToken(req, res, next){
    try {
        const {email, password, old_token} = req.body; 
        const result = await authService.refreshTokens(old_token);
        res.status(200).json(result)
    } catch(e){
        if (e.message === "INVALID_CREDENTIALS") return res.status(401).json({ error: "Not authorized" });
        next(e);
    }
};


module.exports = {registerUser, loginUser, authMeController, updateRefreshToken}